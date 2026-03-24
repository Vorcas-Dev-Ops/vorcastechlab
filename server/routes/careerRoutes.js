import express from 'express';
import asyncHandler from 'express-async-handler';
import Career from '../models/Career.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all careers
// @route   GET /api/careers
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const careers = await Career.findAll();
    res.json(careers);
}));

// @desc    Create a career
// @route   POST /api/careers
// @access  Private/Admin
router.post('/', protect, admin, asyncHandler(async (req, res) => {
    const { title, location, type, description, requirements, applicationUrl } = req.body;
    
    // Sequelize create persists the model instantly
    const career = await Career.create({
        title,
        location,
        type,
        description,
        requirements,
        applicationUrl
    });

    res.status(201).json(career);
}));

// @desc    Update a career
// @route   PUT /api/careers/:id
// @access  Private/Admin
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const { title, location, type, description, requirements, responsibilities, department, experience, salary } = req.body;
    
    const career = await Career.findByPk(req.params.id);
    if (career) {
        career.title = title || career.title;
        career.location = location || career.location;
        career.type = type || career.type;
        career.description = description || career.description;
        career.requirements = requirements || career.requirements;
        career.responsibilities = responsibilities || career.responsibilities;
        career.department = department || career.department;
        career.experience = experience || career.experience;
        career.salary = salary || career.salary;

        const updatedCareer = await career.save();
        res.json(updatedCareer);
    } else {
        res.status(404);
        throw new Error('Career not found');
    }
}));

// @desc    Delete a career
// @route   DELETE /api/careers/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {

    const career = await Career.findByPk(req.params.id);
    if (career) {
        await career.destroy();
        res.json({ message: 'Career removed' });
    } else {
        res.status(404);
        throw new Error('Career not found');
    }
}));

export default router;
