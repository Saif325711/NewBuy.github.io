const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    const user = await User.findOne({ email });

    if (!user) {
        console.log('User not found');
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User found:', user.email);
    console.log('Stored hashed password:', user.password);

    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);

    if (isMatch) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const db = require('../config/db'); // Require db here or default import
        const bcrypt = require('bcryptjs');

        const updatedData = {
            name: req.body.name || user.name,
            email: req.body.email || user.email,
        };

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(req.body.password, salt);
        }

        await db.collection('users').doc(req.user._id).update(updatedData);

        res.json({
            _id: user._id,
            name: updatedData.name,
            email: updatedData.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        // Don't send passwords
        const safeUsers = users.map(u => ({ _id: u._id, name: u.name, email: u.email, role: u.role }));
        res.json(safeUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, getUsers };
