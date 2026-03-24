import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  dialectOptions: {
    ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL Connected...');
        // Sync models
        await sequelize.sync({ alter: true });
        console.log('All models synchronized.');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export { sequelize, connectDB };
export default sequelize;
