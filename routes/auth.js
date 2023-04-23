const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json
      ({ message: 'User already exists' });
    }

    // Hash the password  (10 is the number of rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });


    // Save the user to the database
    await user.save();

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    // Send the token in a HTTP-only cookie


    // Send the user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login a user 
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

try {
// Check if user exists
const user = await User.findOne({ email });
if (!user) {
return res.status(400).json({ message: 'Invalid email or password' });
}
// Check if password is correct
const passwordMatch = await bcrypt.compare(password, user.password);
if (!passwordMatch) {
  return res.status(400).json({ message: 'Invalid email or password' });
}

// Generate JWT token
const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });

res.status(200).json({ token });
} catch (error) {
  res.status(500).json({ message: 'An error occurred while logging in' });
  }
  });
  
  module.exports = router;
  