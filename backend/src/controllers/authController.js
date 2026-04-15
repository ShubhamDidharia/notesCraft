import jwt from 'jsonwebtoken';

import User from '../models/User.js';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const user = await User.create({ name, email, password });

  return res.status(201).json({
    token: createToken(user._id),
    user,
  });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.status(200).json({
    token: createToken(user._id),
    user,
  });
};

export const getMe = async (req, res) => {
  return res.status(200).json(req.user);
};
