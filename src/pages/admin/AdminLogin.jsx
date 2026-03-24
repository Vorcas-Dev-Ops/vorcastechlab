import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            navigate('/admin/dashboard');
        } catch (error) {
            setError('Invalid credentials. Access denied.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full"></div>

             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-12 rounded-[2.5rem] relative z-10"
             >
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-full bg-orange-500/10 mb-6 text-orange-500">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Vorcas Admin</h1>
                    <p className="text-white/40 text-sm">Secure access to the command center.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-white/30 ml-2 tracking-widest">Email Address</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white/[0.08] transition-all text-sm"
                                placeholder="name@vorcas.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-white/30 ml-2 tracking-widest">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input 
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white/[0.08] transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4.5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-500 hover:text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 group shadow-xl"
                    >
                        {loading ? 'Authenticating...' : 'Enter Dashboard'} 
                        {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <button onClick={() => navigate('/')} className="text-[10px] uppercase font-bold text-white/20 hover:text-white/60 tracking-widest transition-colors">
                        ← Back to Website
                    </button>
                </div>
             </motion.div>
        </div>
    );
};

export default AdminLogin;
