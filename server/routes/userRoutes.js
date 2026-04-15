import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get users list (limited to 20)
// @route   GET /api/users
// @access  Admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'isAdmin'],
        limit: 20,
        order: [['createdAt', 'DESC']],
    });

    res.json(users);
}));

export default router;
