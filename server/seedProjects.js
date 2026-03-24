import Project from './models/Project.js';
import User from './models/User.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const seedPortfolio = async () => {
    try {
        await connectDB();
        
        // Find the admin user
        const admin = await User.findOne({ where: { email: 'admin@vorcas.com' } });
        if (!admin) {
            console.error('Admin user not found. Run node seed.js first.');
            process.exit(1);
        }

        const projects = [
            {
                projectId: 'luxury-architecture',
                title: 'Aura Architecture',
                category: 'Visual Identity & Web',
                image: 'https://images.unsplash.com/photo-1600585154340-be6099aae359?auto=format&fit=crop&w=1200&q=80',
                description: 'Aura Architecture is a high-end design firm specializing in minimalist, sustainable living spaces. We crafted a digital experience that reflects their commitment to precision and elegance.',
                approach: 'We focused on high-contrast visuals and smooth, scroll-triggered animations to mirror the architectural experience of moving through a physical space.',
                siteUrl: 'https://aura-arch.example.com',
                client: 'Aura Design Group',
                duration: '6 Weeks',
                userId: admin.id,
                images: [
                    'https://images.unsplash.com/photo-1600585154340-be6099aae359?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1600566752355-35792ec4caec?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                projectId: 'tech-nexus',
                title: 'TechNexus E-Commerce',
                category: 'Product & UX Design',
                image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
                description: 'TechNexus is a futuristic hardware brand. We redesigned their entire e-commerce funnel to reduce friction and emphasize product sophistication.',
                approach: 'Using glassmorphic elements and orange accent glows, we created a UI that feels like the hardware it sells—sleek, powerful, and next-gen.',
                siteUrl: 'https://technexus.example.com',
                client: 'Nexus Global',
                duration: '8 Weeks',
                userId: admin.id,
                images: [
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
                ]
            },
            {
                projectId: 'zenith-wellness',
                title: 'Zenith Wellness App',
                category: 'Mobile App Design',
                image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
                description: 'Zenith is a lifestyle app focused on mental clarity and holistic health. We developed a soft-themed interface that reduces cognitive load.',
                approach: 'We utilized organic shapes and a calming color palette of sage and cream to ensure users feel relaxed the moment they open the app.',
                siteUrl: 'https://zenith-app.example.com',
                client: 'Zenith Health',
                duration: '4 Weeks',
                userId: admin.id,
                images: [
                    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1518314916301-73c31671168f?auto=format&fit=crop&w=800&q=80'
                ]
            }
        ];

        for (const p of projects) {
            const existing = await Project.findOne({ where: { projectId: p.projectId } });
            if (existing) {
                console.log(`Project ${p.projectId} exists. Updating...`);
                await existing.update(p);
            } else {
                console.log(`Creating project ${p.projectId}...`);
                await Project.create(p);
            }
        }

        console.log('Portfolio seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding portfolio:', error.message);
        process.exit(1);
    }
};

seedPortfolio();
