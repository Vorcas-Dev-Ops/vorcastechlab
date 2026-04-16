import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public (Admin Only)
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log('AUTH LOGIN attempt:', { email, passwordProvided: Boolean(password) });

    const user = await User.findOne({ where: { email } });
    console.log('AUTH LOGIN user found:', user ? { email: user.email, isAdmin: user.isAdmin } : null);

    if (user) {
        const passwordMatch = await user.matchPassword(password);
        console.log('AUTH LOGIN passwordMatch:', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Enforce admin-only login
        if (!user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized as an admin. Access denied.' });
        }

        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user.id),
        });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
}));

// Public registration disabled for security. 
// Use seed script or admin panel for user management.
/*
router.post('/register', asyncHandler(async (req, res) => {
    ...
}));
*/

router.get('/debug-admin', asyncHandler(async (req, res) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vorcas.com';
    const user = await User.findOne({ where: { email: adminEmail } });

    res.json({
        databaseUrlConfigured: Boolean(process.env.DATABASE_URL),
        adminEmail,
        adminUserFound: Boolean(user),
        isAdmin: user ? Boolean(user.isAdmin) : false,
        userEmail: user ? user.email : null,
    });
}));

export default router;
