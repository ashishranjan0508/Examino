const {Question, Option, Exam} = require("../models/association.js");

// Add question controllers  <<<<<<<<<<---oo-------______||______-------oo--->>>>>>>>>>>>>

const addQuestion = async (req, res) => {
    try {
     const {examId} = req.params;
     const { questionText, marks, type, options } = req.body;
     const questionType = type || "MCQ";

     if(!questionText || !options || options.length < 2) {
        return res.status(400).json({
             success: false, 
             message: "Question must have question text and at least 2 options"
        });
     }
     const exam = await Exam.findOne({where : {examId}});
     if(!exam) {
        return res.status(400).json({ 
             success: false, 
             message: "Exam  not found"
        })
     }

     if(exam.teacherId !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to add questions to this exam"});
     }
     const newQuestion = await Question.create({
        examId,
        type : questionType,
        questionText,
        marks: marks || 1
     });

     const formattedOptions = options.map(opt => ({
      optionText : opt.optionText,
      isCorrect : opt.isCorrect || false,
      questionId : newQuestion.id
     }));

     await Option.bulkCreate(formattedOptions);

     return res.status(201).json({success: true, message: "Question created successfully", newQuestion});

    }catch(error) {
      console.log("Error in adding question: ", error);
      return res.status(500).json({success: false, message: "Internal server error"});
    }
}



// get question for an exam controllers  <<<<<<<<<<---oo-------______||______-------oo--->>>>>>>>>>>>>


const getQuestionsByExam = async (req, res) => {
    try{
        const {examId} = req.params;
        const userId = req.user.id;
        const userRole = req.body.userRole;

        const exam = await Exam.findOne({where: {examId}});
        if(!exam) {
         return res.status(404).json({success: false, message: "Exam not found"});
        }

        if(userRole === 'teacher' && exam.teacherId !== userId) {
         return res.status(403).json({ message: "Unauthorized" });
        }

        const attributesToShow = (userRole === 'teacher') ? 
        ['id', 'optionText', 'isCorrect'] :
        ['id', 'optionText'];

        const question = await Question.findAll(
         {where: {examId},
         attributes: ['id', 'questionText', 'marks'],
         include: [{
            model: Option,
            as: 'options',
            attributes: attributesToShow
         }]
        });
        return res.status(200).json({success: true, question});
    } catch(error) {
      console.error("The error in getQuestionsByExam: ", error);
      return res.status(500).json({ message: "Server Error" });
    }
}

// Delete question for an exam by teacher controllers
//   <<<<<<<<<<---oo-------______||______-------oo--->>>>>>>>>>>>>

const deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const userId = req.user.id;
        const userRole = req.body.userRole;

        const question = await Question.findOne({where: {questionId}});
        
        if (!question) return res.status(404).json({ message: "Question not found" });

        const exam = await Exam.findOne({where: {examId : question.examId}});  // question.examId islye access kr paye kyu ki when we do association like 
                                                                              //   Exam hasMany Questions then question table has a hiden column of examId

        if(userRole !== 'teacher'|| !exam || exam.teacherId !== userId) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized! You can only delete questions from your own exams." 
            });
        }
        await question.destroy();

        return res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
        console.log("Error in DeleteQuestion inside questionController");
        return res.status(500).json({ message: "Error" });
    }
};


module.exports = { addQuestion, getQuestionsByExam, deleteQuestion };


