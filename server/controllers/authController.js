const UserDB = require('../models/userModel');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await UserDB.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserDB.create({ name, email, password: hashedPassword, role });

    const token = generateToken(user._id, user.role);
    res.status(201).json({ _id: user._id, name, email, role: user.role, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserDB.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.isBanned) {
      return res.status(403).json({ message: 'Your account has been banned by admin' });
    }

    const token = generateToken(user._id, user.role);
    res.json({ _id: user._id, name: user.name, email, role: user.role, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
