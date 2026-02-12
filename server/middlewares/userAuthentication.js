const { User } = require("../models/association");
const jwt = require("jsonwebtoken");
require("dotenv").config(); 

const userAuthentication = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) { 
        return res.status(401).json({ success: false, message: "Token missing or invalid format" });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
       req.user = await User.findOne({ where: { id: decode.id },
                 attributes: ['id', 'name', 'email', 'userRole']
         });


        if (!req.user) return res.status(401).json({ success: false, message: "User not found" });
        next(); 
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

module.exports = userAuthentication;