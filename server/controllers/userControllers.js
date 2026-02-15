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
        let normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ where: { email: normalizedEmail } });
     
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" }); 
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        const newUser = await User.create({
            name,
            email: normalizedEmail,
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

        let normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ where: { email: normalizedEmail } });
       
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
