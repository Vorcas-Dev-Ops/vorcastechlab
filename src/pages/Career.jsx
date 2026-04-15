import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock } from 'lucide-react';

const Career = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchCareers = async () => {
            try {
                const response = await fetch('/api/careers');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setJobs(data);
                }
            } catch (error) {
                console.error('Error fetching careers:', error);
            }
        };
        fetchCareers();
    }, []);

    const normalizeArray = (field) => {
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') return field.split(',').map((item) => item.trim()).filter(Boolean);
        return [];
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-20 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        variants={fadeUp}
                        className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold mb-6 tracking-widest text-orange-500 uppercase"
                    >
                        Join Our Team
                    </motion.div>
                    <motion.h1
                        initial="hidden"
                        whileInView="show"
                        variants={fadeUp}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Build the <span className="text-orange-500 underline decoration-white/20 underline-offset-8">Future</span> with Vorcas
                    </motion.h1>
                    <motion.p
                        initial="hidden"
                        whileInView="show"
                        variants={fadeUp}
                        className="text-white/60 text-lg max-w-2xl mx-auto"
                    >
                        We’re looking for bold minds and meticulous craftsmen to help us push the boundaries of digital excellence.
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {jobs.map((job, idx) => {
                        const requirements = normalizeArray(job.requirements);
                        const responsibilities = normalizeArray(job.responsibilities);

                        return (
                            <motion.div
                                key={job.id}
                                initial="hidden"
                                whileInView="show"
                                variants={fadeUp}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-orange-500/50 transition-all group relative overflow-hidden"
                            >
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase font-bold text-white/60">
                                        <MapPin size={12} /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase font-bold text-white/60">
                                        <Clock size={12} /> {job.type}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold mb-4 group-hover:text-orange-500 transition-colors">{job.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed mb-8">
                                    {job.description}
                                </p>

                                {!!job.department && (
                                    <div className="mb-4 text-sm text-white/60">
                                        <strong>Department:</strong> {job.department}
                                    </div>
                                )}
                                {!!job.experience && (
                                    <div className="mb-4 text-sm text-white/60">
                                        <strong>Experience:</strong> {job.experience}
                                    </div>
                                )}
                                {!!job.salary && (
                                    <div className="mb-4 text-sm text-white/60">
                                        <strong>Salary:</strong> {job.salary}
                                    </div>
                                )}

                                <div className="space-y-3 mb-8">
                                    <h4 className="text-[11px] uppercase font-black text-white/30 tracking-widest">Requirements</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {requirements.length > 0 ? requirements.map((req, rIdx) => (
                                            <span key={rIdx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-white/80">
                                                {req}
                                            </span>
                                        )) : (
                                            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-white/80">No specific requirements listed.</span>
                                        )}
                                    </div>
                                </div>

                                {responsibilities.length > 0 && (
                                    <div className="space-y-3 mb-8">
                                        <h4 className="text-[11px] uppercase font-black text-white/30 tracking-widest">Responsibilities</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {responsibilities.map((responsibility, rIdx) => (
                                                <span key={rIdx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-white/80">
                                                    {responsibility}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button className="w-full py-3.5 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-[11px] hover:bg-orange-500 hover:text-white transition-all transform active:scale-[0.98]">
                                    Apply for this Position
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-20 p-10 rounded-[2.5rem] bg-gradient-to-br from-orange-500/10 to-transparent border border-white/5 text-center">
                    <h3 className="text-2xl font-bold mb-4">Don’t see a role for you?</h3>
                    <p className="text-white/60 mb-8 mx-auto max-w-lg">
                        We’re always on the hunt for top talent. If you have a passion for high-end digital design and engineering, send us your portfolio anyway.
                    </p>
                    <a href="mailto:careers@vorcastechlab.com" className="inline-flex items-center gap-2 text-orange-500 font-bold hover:underline">
                        careers@vorcastechlab.com <Briefcase size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Career;
