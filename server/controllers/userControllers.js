require('dotenv').config();
const { User } = require("../models/association"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Controller for User Registration -------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const registerUser = async (req, res) => {
    try {
        const { name, email, password,  studentRollNo, userRole } = req.body;
       
        if (!name || !email || !password || !userRole) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
 
        if (password.length < 6 || password.length > 20) {
      
            return res.status(400).json({                                         
                success: false,
                message: "Password must be between 6 and 20 characters"
            });
       
        }

        const existingUser = await User.findOne({ where: { email } });
     
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" }); 
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        const newUser = await User.create({
            name,
            email,
            studentRollNo,
            password: hashedPassword,
            userRole: userRole || 'student'
        });
  
        const token = jwt.sign(
            { id: newUser.id, userRole: newUser.userRole},
             process.env.JWT_SECRET, 
            { expiresIn: "5h" }
        );

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: { // details for frontend 
              id: newUser.id, 
              name: newUser.name, 
              studentRollNo: newUser.studentRollNo,
               userRole: newUser.userRole
               } 
        });

    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};







// Controller for User Login ------------------------------------------------>>>>>>>>>>>>>>>>

const loginUser = async (req, res) => {
  console.log("This is our secret", process.env.JWT_SECRET);
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
          console.log("Bug catcher in login 2")
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const existingUser = await User.findOne({ where: { email } });
       
        if (!existingUser) {
          
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
       
        const isMatch = await bcrypt.compare(password, existingUser.password);
        
        if (!isMatch) {
           
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
      
        const token = jwt.sign(
            { id: existingUser.id, userRole: existingUser.userRole},
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );
      
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: { 
               id: existingUser.id,
               name: existingUser.name, 
               studentRollNo: existingUser.studentRollNo,
               userRole: existingUser.userRole 
              }
           });

    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { registerUser, loginUser };












-----------------------------------------------------------------------------------------

const { Question, Option, Exam } = require("../models/association");

// ==========================================
// 1. Add Question (with Options) ➕
// ==========================================
const addQuestion = async (req, res) => {
    try {
        const { examId } = req.params; // URL se milega
        const { content, marks, options } = req.body; 
        // options array hona chahiye: [{text: "A", isCorrect: true}, {text: "B", isCorrect: false}...]

        // 1. Validation
        if (!content || !options || options.length < 2) {
            return res.status(400).json({ 
                success: false, 
                message: "Question must have content and at least 2 options" 
            });
        }

        // 2. Check: Kya Exam exist karta hai?
        const exam = await Exam.findByPk(examId);
        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        // 3. Check: Kya ye Teacher isi exam ka owner hai? (Security 🔒)
        if (exam.teacherId !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: "You are not authorized to add questions to this exam" 
            });
        }

        // 4. Create Question
        const newQuestion = await Question.create({
            content,
            marks: marks || 1, // Agar marks nahi diye to default 1
            examId
        });

        // 5. Link Options to Question
        // Options array mein 'questionId' jodna padega
        const formattedOptions = options.map(opt => ({
            text: opt.text,
            isCorrect: opt.isCorrect || false,
            questionId: newQuestion.id // Ye important hai! Link kar raha hai
        }));

        // 6. Save All Options at Once (Bulk Create)
        await Option.bulkCreate(formattedOptions);

        return res.status(201).json({
            success: true,
            message: "Question added successfully!",
            question: newQuestion
        });

    } catch (error) {
        console.error("Error adding question:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ==========================================
// 2. Get Questions of an Exam 📜
// ==========================================
const getQuestionsByExam = async (req, res) => {
    try {
        const { examId } = req.params;

        const questions = await Question.findAll({
            where: { examId },
            include: [
                {
                    model: Option,
                    as: 'options', // Association file mein jo 'as' likha tha wahi use karo
                    attributes: ['id', 'text', 'isCorrect'] 
                }
            ]
        });

        if (!questions) {
            return res.status(404).json({ success: false, message: "No questions found" });
        }

        return res.status(200).json({
            success: true,
            count: questions.length,
            questions
        });

    } catch (error) {
        console.error("Error fetching questions:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ==========================================
// 3. Delete Question 🗑️
// ==========================================
const deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        // Question dhoondo
        const question = await Question.findByPk(questionId);

        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }
        
        // (Optional: Yahan bhi check kar sakte ho ki teacher owner hai ya nahi)

        await question.destroy(); // Ye apne aap Options bhi uda dega agar CASCADE on hai

        return res.status(200).json({ success: true, message: "Question deleted successfully" });

    } catch (error) {
        console.error("Error deleting question:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { addQuestion, getQuestionsByExam, deleteQuestion };