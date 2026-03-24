import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Blog = sequelize.define('Blog', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    excerpt: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT, // Base64 storage
        allowNull: true
    },
    author: {
        type: DataTypes.STRING,
        defaultValue: 'Vorcas Techlab'
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'Technology'
    }
}, {
    timestamps: true
});

export default Blog;
