import upload from '../middleware/uploadMiddleware.js';
import express from 'express';
import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { cacheResponse } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Local helper to convert buffer into Base64 Data URL for Postgres storage
const convertToBase64 = (file) => {
    const base64 = file.buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64}`;
};

// @desc    Fetch all projects with pagination
// @route   GET /api/projects?page=1&limit=12
// @access  Public
router.get('/', cacheResponse(120), asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const { count, rows } = await Project.findAndCountAll({
        attributes: ['projectId', 'title', 'category', 'image'],
        offset,
        limit,
        order: [['createdAt', 'DESC']]
    });

    res.json({
        projects: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
    });
}));

// @desc    Fetch single project
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', cacheResponse(120), asyncHandler(async (req, res) => {
    const project = await Project.findOne({ where: { projectId: req.params.id } });
    if (project) {
        res.json(project);
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
}));

// @desc    Create a project (with Local DB Image Storage)
// @route   POST /api/projects
// @access  Private/Admin
router.post('/', protect, admin, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'detailImages', maxCount: 10 }
]), asyncHandler(async (req, res) => {
    const { projectId, title, category, client, duration, description, approach, problem, solution, sectionsConfig, siteUrl, colSpan, showGalleryFirst } = req.body;
    
    const projectExists = await Project.findOne({ where: { projectId } });
    if (projectExists) {
        res.status(400);
        throw new Error('Project ID already exists');
    }

    let imageUrl = req.body.image;
    let detailImageUrls = req.body.images ? 
        (typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images) 
        : [];

    // Store Primary Image in DB as Base64
    if (req.files['image']) {
        imageUrl = convertToBase64(req.files['image'][0]);
    }

    // Store Gallery Images in DB as Base64
    if (req.files['detailImages']) {
        detailImageUrls = req.files['detailImages'].map(file => convertToBase64(file));
    }

    const project = await Project.create({
        userId: req.user.id,
        projectId,
        title,
        category,
        client,
        duration,
        image: imageUrl,
        description,
        approach,
        problem,
        solution,
        sectionsConfig: sectionsConfig ? (typeof sectionsConfig === 'string' ? JSON.parse(sectionsConfig) : sectionsConfig) : undefined,
        siteUrl,
        images: detailImageUrls,
        colSpan,
        showGalleryFirst: showGalleryFirst === 'true' || showGalleryFirst === true
    });

    res.status(201).json(project);
}));

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'detailImages', maxCount: 10 }
]), asyncHandler(async (req, res) => {
    const { title, category, client, duration, description, approach, problem, solution, sectionsConfig, siteUrl, colSpan, showGalleryFirst } = req.body;
    
    // Find project by the unique custom projectId
    const project = await Project.findOne({ where: { projectId: req.params.id } });

    if (project) {
        project.title = title || project.title;
        project.category = category || project.category;
        project.client = client || project.client;
        project.duration = duration || project.duration;
        project.description = description || project.description;
        project.approach = approach || project.approach;
        project.problem = problem !== undefined ? problem : project.problem;
        project.solution = solution !== undefined ? solution : project.solution;
        if (sectionsConfig) {
            project.sectionsConfig = typeof sectionsConfig === 'string' ? JSON.parse(sectionsConfig) : sectionsConfig;
        }
        project.siteUrl = siteUrl || project.siteUrl;
        project.colSpan = colSpan || project.colSpan;
        if (showGalleryFirst !== undefined) {
            project.showGalleryFirst = showGalleryFirst === 'true' || showGalleryFirst === true;
        }

        // Process Primary Image if uploaded
        if (req.files['image']) {
            project.image = convertToBase64(req.files['image'][0]);
        } else if (req.body.image) {
            project.image = req.body.image;
        }

        // Process Gallery Images if uploaded
        if (req.files['detailImages']) {
            project.images = req.files['detailImages'].map(file => convertToBase64(file));
        } else if (req.body.images) {
            project.images = Array.isArray(req.body.images) ? req.body.images : JSON.parse(req.body.images);
        }

        const updatedProject = await project.save();
        res.json(updatedProject);
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
}));


// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const project = await Project.findOne({ where: { projectId: req.params.id } });
    if (project) {
        await project.destroy();
        res.json({ message: 'Project removed' });
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
}));

export default router;
