import express from 'express';
import asyncHandler from 'express-async-handler';
import Blog from '../models/Blog.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

const convertToBase64 = (file) => {
    const base64 = file.buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64}`;
};

// @desc    Fetch all blogs
// @route   GET /api/blogs
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const blogs = await Blog.findAll({ order: [['createdAt', 'DESC']] });
    res.json(blogs);
}));

// @desc    Fetch single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
router.get('/:slug', asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ where: { slug: req.params.slug } });
    if (blog) {
        res.json(blog);
    } else {
        res.status(404);
        throw new Error('Blog not found');
    }
}));

// @desc    Create a blog (Base64 Image Storage)
// @route   POST /api/blogs
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), asyncHandler(async (req, res) => {
    const { title, slug, category, excerpt, content, author } = req.body;
    
    const slugExists = await Blog.findOne({ where: { slug } });
    if (slugExists) {
        res.status(400);
        throw new Error('Slug already exists');
    }

    let imageUrl = '';
    if (req.file) {
        imageUrl = convertToBase64(req.file);
    }

    const blog = await Blog.create({
        title,
        slug,
        category,
        excerpt,
        content,
        author,
        image: imageUrl
    });

    res.status(201).json(blog);
}));

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), asyncHandler(async (req, res) => {
    const { title, slug, category, excerpt, content, author } = req.body;
    
    const blog = await Blog.findByPk(req.params.id);
    if (blog) {
        blog.title = title || blog.title;
        blog.slug = slug || blog.slug;
        blog.category = category || blog.category;
        blog.excerpt = excerpt || blog.excerpt;
        blog.content = content || blog.content;
        blog.author = author || blog.author;

        if (req.file) {
            blog.image = convertToBase64(req.file);
        } else if (req.body.image) {
            blog.image = req.body.image;
        }

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } else {
        res.status(404);
        throw new Error('Blog not found');
    }
}));

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const blog = await Blog.findByPk(req.params.id);

    if (blog) {
        await blog.destroy();
        res.json({ message: 'Blog removed' });
    } else {
        res.status(404);
        throw new Error('Blog not found');
    }
}));

export default router;
