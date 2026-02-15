const {User, Exam, Result, Answer, Question, Option} = require("../models/association");

// Controller for Creating Exam -------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const createExam = async (req, res) => {
    try {
        const currentTeacherId = req.user.id;
        const { title, description, duration } = req.body;
        if (!title || !duration) {
            return res.status(400).json({ success: false, message: "Title and duration are required" });
        }

        const joinCode = Math.floor(10000000 + Math.random() * 90000000);
        const newExam = await Exam.create({
            title,
            description,
            duration,
            joinCode,
            teacherId: currentTeacherId,
            isLive: false
        });
        return res.status(201).json({ success: true, message: "Exam created successfully", exam: newExam });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};




// Controller for Getting All Exams -------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const getExamsByTeacher = async (req, res) => {
    try {
        const currentTeacherId = req.user.id;
        const exams = await Exam.findAll({where:{teacherId: currentTeacherId},
         include: {
         model: User,
         as: 'teacher',
         attributes:['name']
        },
        order: [['createdAt', 'DESC']]           
        });
        return res.status(200).json({ success: true, count: exams.length, exams }); // yahn frontend  ko pura exam table milega usse examid leke phir se addQuestion ko de skte h
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error",error});
    }
};




// To make the exam live -----------------------------------------------------------------
const toggleExamStatus = async (req, res) => {
    try{
    const {examId} = req.params;
    const userId = req.user.id;

    const exam = await Exam.findOne({where: {id: examId}});
    if(!exam) {
        return res.status(404).json({success: false, message: "Exam not found"});
    }

    if(userId !== exam.teacherId) {
        return res.status(403).json({success: false, message: "You are not authorized"});
    }
    
    exam.isLive = !exam.isLive;
    await exam.save();

    return res.status(200).json({ 
            success: true, 
            message: `Exam is now ${exam.isLive ? "LIVE 🟢" : "Closed 🔴"}`, 
            isLive: exam.isLive 
    });
  } catch(error) {
    return res.status(500).json({ success: false, message: "Internal server error", error});
  }
};




// Join exam by student using joining code--------------------------------------------

const joinExam = async (req, res) => {
    try{
    const {joinCode} = req.body;
    const exam = await Exam.findOne({where: {joinCode}});

    if(!exam) {
      return res.status(404).json({success: false, message: "Enter valid joining code"});  
    }
    
     if(!exam.isLive){
        return res.status(400).json({ success: false, message: "Exam has not started yet!"});
     }

     return res.status(200).json({
            success: true,
            message: "Joined Successfully",
            exam: {
                id: exam.id,
                title: exam.title,
                duration: exam.duration,
                description: exam.description
            }
        });

   } catch(error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
   }

};


// start the exam means, student start to attempt the question------------------------------------------

const startExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const studentId = req.user.id;
        const exam = await Exam.findOne({where: {id: examId}});

        if (!exam || !exam.isLive) return res.status(400).json({ message: "Exam is not live" });

        let result = await Result.findOne({ where: { examId, studentId } });

        if (!result) {
                                        // First time starting , Create entry with Start Time
            result = await Result.create({
                studentId,
                examId,
                startTime: new Date(),
                status: 'Live',
                score: 0,
                totalMarks: 0
            });
        }

        return res.status(200).json({
            success: true,
            startTime: result.startTime,
            duration: exam.duration
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};



// Submit exam by student-----------------------------------------------------


const submitExam = async (req, res) => {
    try {
        const {examId} = req.params;
        const {answers} = req.body; 
        const studentId = req.user.id;

        const exam = await Exam.findOne({ where: {id: examId}});
        const result = await Result.findOne({where: {examId, studentId}});

        
        if (!result) return res.status(400).json({ message: "Start exam first" });
        if (result.status === 'Completed') return res.status(400).json({ message: "Already Submitted" });

        
        const startTime = new Date(result.startTime).getTime(); //here we are converting time into number for comparission i can read later if i forgeted 
        const currentTime = new Date().getTime();
        const examDurationMs = exam.duration * 60 * 1000;
        
        const gracePeriod = 5 * 60 * 1000; // 5 Minutes Buffer time
        
        const maxAllowedTime = startTime + examDurationMs + gracePeriod;

        if (currentTime > maxAllowedTime) {    // 5 min ke baad bhi submit nahi krne pe, submittion not allowed 
            return res.status(400).json({       // this 5 min time is grace period which is calcuated in calculation of maxAllowedTime.
                message: "Submission Rejected: Time limit exceeded significantly." 
            });
        }

        //  Fetch Questions & Process
        const dbQuestions = await Question.findAll({
            where: {examId},
            include: {
                model: Option,
                as: 'options'
            }           
        });

        let totalScore = 0;
        let totalMarks = 0;
        let answerDataToSave = [];

        // Auto Checking
        // answer is a list/ array, which will bring from frontend a object { questionId: 101, selectedOptionId: 5 }
        dbQuestions.forEach(question => {
            totalMarks += question.marks || 1;
            const studentResponse = answers.find(ans => ans.questionId === question.id);
            let selectedOptionId = null;
            let isCorrect = false;

            let answerText = null;
            let marksAwarded = 0;


            // Yahan hum ye assume kar rahe hain ki Frontend ne 00:00 hone par
            // screen lock kar di thi, aur ye wahi data hai jo us waqt tak bhara gaya tha.
            // If question type is mcq
            if (question.type === 'MCQ') {
                if (studentResponse && studentResponse.selectedOptionId) {
                    selectedOptionId = studentResponse.selectedOptionId;
                    
                    // Check Sahi Jawab
                    const correctOption = question.options.find(opt => opt.isCorrect === true);
                    
                    if (correctOption && selectedOptionId === correctOption.id) {
                        isCorrect = true;       
                        marksAwarded = question.marks || 1; 
                        totalScore += marksAwarded; 
                    }
                }
            } 
            
            // if question type is long
            else if (question.type === 'LONG') {
                if (studentResponse && studentResponse.answerText) {
                    answerText = studentResponse.answerText; 
                }
                // long type is null to check later is it checked or not
                isCorrect = null; 
                marksAwarded = 0; // later after check teacher can update it in database
            }
            answerDataToSave.push({
                examId,
                questionId: question.id,
                studentId,
                selectedOptionId,
                isCorrect,
                marksAwarded,
                answerText
            });
        });

        // Save Data
        if (answerDataToSave.length > 0) await Answer.bulkCreate(answerDataToSave);

        // Update Result
        result.score = totalScore;
        result.totalMarks = totalMarks;
        result.status = 'Completed';
        result.endTime = new Date();
        await result.save();

        return res.status(200).json({
            success: true,
            message: "Submitted Successfully",
            result: { score: totalScore, totalMarks }
        });

    } catch (error) {
        console.error("Submit Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


module.exports = { createExam, getExamsByTeacher, toggleExamStatus, joinExam, startExam, submitExam};