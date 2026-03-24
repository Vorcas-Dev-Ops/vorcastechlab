import User from './models/User.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
    try {
        await connectDB();
        
        const existingUser = await User.findOne({ where: { email: 'admin@vorcas.com' } });
        if (existingUser) {
            console.log('Admin user already exists. Updating password...');
            existingUser.password = 'password123';
            await existingUser.save(); // This should trigger the hook
            console.log('Password updated.');
        } else {
            console.log('Creating new admin user...');
            await User.create({
                name: 'Vorcas Admin',
                email: 'admin@vorcas.com',
                password: 'password123',
                isAdmin: true
            });
            console.log('New admin user created.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin user:', error.message);
        process.exit(1);
    }
};

seed();
