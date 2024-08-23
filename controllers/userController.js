import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { createToken } from '../jwt/index.js';

// log in user
const logInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    // Create a token for the authenticated user
    const token = createToken(user._id);

    // Respond with success and token
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error logging in user',
      error: error.message,
    });
  }
};

// sign up user
const signUpUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Validate email format
    if (!validator.isEmail(email)) {
      return res
      .status(400)
      .json({ success: false, message: 'Provide a valid email' });
    }
    
    // Validate password strength
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
        'Provide a strong password (e.g., P@ssw0rd2024): 8+ chars, upper & lower case, number, symbol.',
      });
    }

    // Check if the user already exists
    const userExists = await userModel.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Create a token for the new user
    const token = createToken(savedUser._id);

    // Respond with success and token
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
};

export { logInUser, signUpUser };
