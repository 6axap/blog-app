const express = require('express');
const User = require('../models/User');
const auth = require('../middlewares/auth');

const router = express.Router();

// Get the user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId, '-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while getting the user profile' });
  }
});

// Update the user profile
router.put('/me', auth, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the user profile' });
  }
});

module.exports = router;