const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { registerUser, loginUser } = require('../controller/authController.js');
const User = require('../models/User.js'); 

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/forgot-password', async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
  
      await user.save();
      res.json({ message: 'Password reset successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  });

module.exports = router;