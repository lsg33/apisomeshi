const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

// Initialize Express
const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://forcesspecial801:oCqg7zZg0MA95I5b@cluster777.atoevuq.mongodb.net/cluster777', { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', userSchema);

// Registration Route (Existing)
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if email ends with '@certaindomail.com'
  if (!email.endsWith('@jccschools.net')) {
    return res.status(400).json({ success: false, message: 'Sorry, your email must end with @jccschools.net' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();
    res.json({ success: true });
  } catch (error) {
    // Handle errors (e.g., duplicate email)
    res.status(400).json({ success: false, message: 'Email already exists or invalid data.' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Email not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    // Successful login
    res.json({ success: true, message: 'Login successful!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start Server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
