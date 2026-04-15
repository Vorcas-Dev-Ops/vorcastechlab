import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Career = sequelize.define('Career', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: { // Full-time, Remote, etc.
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true
    },
    experience: {
        type: DataTypes.STRING,
        allowNull: true
    },
    salary: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    requirements: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    responsibilities: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    applicationUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

export default Career;
