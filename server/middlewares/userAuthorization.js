const isTeacher = (req, res, next) => {
    if (req.user.userRole !== 'teacher'){ 
        return res.status(403).json({ success: false, message: "Access denied! Teachers only." });
    }
    next();
};

const isStudent = (req, res, next) => {
    if (req.user.userRole !== 'student') { 
        return res.status(403).json({ success: false, message: "Access denied! Students only." });
    }
    next();
};

module.exports = { isTeacher, isStudent };