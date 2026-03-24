import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Project = sequelize.define('Project', {
    projectId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    approach: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    siteUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    client: {
        type: DataTypes.STRING,
        allowNull: true
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: true
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: []
    },
    colSpan: {
        type: DataTypes.STRING,
        defaultValue: 'col-span-1 border border-white/10 rounded-3xl'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    showGalleryFirst: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

export default Project;
