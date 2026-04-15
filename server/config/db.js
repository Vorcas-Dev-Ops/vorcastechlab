import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL not set. Using in-memory database.');
}

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      } : undefined,
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: process.env.SQLITE_STORAGE || ':memory:',
      logging: false,
    });

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database Connected...');
        // Sync models
        await sequelize.sync({ alter: true });
        console.log('✅ All models synchronized.');
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        console.error('⚠️ Server will start without database - API calls may fail');
        // Don't exit - let server start anyway
    }
};

export { sequelize, connectDB };
export default sequelize;
