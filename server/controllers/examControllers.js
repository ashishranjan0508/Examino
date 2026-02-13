const {User, Exam} = require("../models/association");

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
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { createExam, getExamsByTeacher };