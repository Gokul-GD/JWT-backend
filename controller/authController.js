const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try{
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User already exists" });      

        
        const hashedPassword = await bcrypt.hash(password, 10);

        const user =  User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({
            id: user._id,name : user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
    

        res.status(201).json({
            token,
            user: {
                name: user.name,
                email: user.email,
            },
        });
       
    } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

    const loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;
          
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ message: "User not found ❌" });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid)
         return res.status(400).json({ message: "Invalid credentials ❌" });

            const token = jwt.sign(
                {id: user._id , name: user.name},
                process.env.JWT_SECRET,
                {expiresIn: "1h"}
            );

            res.status(200).json({ message: "Login successful ✅", token ,
                user: {
                    name: user.name,
                    email: user.email,
                }, 

            });

        } catch (err) {
            res.status(500).json({ error: err.message });
          }
        };
        
        module.exports = { registerUser, loginUser };