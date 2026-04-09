import upload from '../middleware/uploadMiddleware.js';
import express from 'express';
import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Local helper to convert buffer into Base64 Data URL for Postgres storage
const convertToBase64 = (file) => {
    const base64 = file.buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64}`;
};

// @desc    Fetch all projects
// @route   GET /api/projects
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const projects = await Project.findAll();
    res.json(projects);
}));

// @desc    Fetch single project
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
    const project = await Project.findOne({ where: { projectId: req.params.id } });
    if (project) {
        res.json(project);
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
}));

// @desc    Create a project (Now with Local DB Image Storage)
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

    let imageUrl = req.body.image; // Fallback to URL string if provided
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
            project.image = req.body.image; // Assume it's a string if no file uploaded but string sent
        }

        // Process Gallery Images if uploaded
        if (req.files['detailImages']) {
            project.images = req.files['detailImages'].map(file => convertToBase64(file));
        } else if (req.body.images) {
             // Handle case where images are sent as string (e.g. from a form field)
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
