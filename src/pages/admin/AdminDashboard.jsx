import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Trash, LogOut, ChevronRight,
    Briefcase, LayoutGrid, FileText,
    Image as ImageIcon, Globe, Calendar, User, AlignLeft
} from 'lucide-react';

const sanitizeDashboardError = (raw) => {
    let message = raw;
    if (raw?.response?.data?.message) {
        message = raw.response.data.message;
    } else if (raw?.response?.data?.error) {
        message = raw.response.data.error;
    } else if (raw?.response?.data) {
        message = raw.response.data;
    } else if (raw?.message) {
        message = raw.message;
    }

    if (typeof message !== 'string') {
        message = JSON.stringify(message);
    }

    message = message.replace(/<[^>]+>/g, '').trim();

    if (/transfer quota|data transfer quota|upgrade your plan|exceeded.*quota/i.test(message)) {
        return 'Service temporarily unavailable. Please try again later.';
    }

    if (/^<\/?html|<!doctype html/i.test(message) || /<body|<head/i.test(message)) {
        return 'Service temporarily unavailable. Please try again later.';
    }

    return message || 'Service temporarily unavailable. Please try again later.';
};

// --- PROJECTS COMPONENT ---
const ProjectsManager = ({ token }) => {
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        projectId: '', title: '', category: '', client: '',
        duration: '', description: '', approach: '',
        problem: '', solution: '',
        sectionsConfig: [
            { id: 'description', enabled: true, label: 'Description' },
            { id: 'problem', enabled: false, label: 'Problem Statement' },
            { id: 'solution', enabled: false, label: 'The Solution' },
            { id: 'approach', enabled: true, label: 'Our Approach' }
        ],
        siteUrl: '',
        showGalleryFirst: true
    });
    const [mainImage, setMainImage] = useState(null);
    const [detailImages, setDetailImages] = useState([]);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [detailImagesPreviews, setDetailImagesPreviews] = useState([]);

    // --- Rearrange Logic ---
    const moveImage = (index, direction) => {
        const newPreviews = [...detailImagesPreviews];
        const newFiles = [...detailImages];
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= newPreviews.length) return;

        // Swap previews
        [newPreviews[index], newPreviews[newIndex]] = [newPreviews[newIndex], newPreviews[index]];

        // If we have files (newly selected), we might need to swap them too
        // Note: This is tricky because existing images don't have 'File' objects.
        // We'll handle this by converting all to Base64 on submit anyway.
        setDetailImagesPreviews(newPreviews);
    };

    const removeImage = (index) => {
        setDetailImagesPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const moveSection = (index, direction) => {
        const newConfig = [...formData.sectionsConfig];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newConfig.length) return;
        [newConfig[index], newConfig[newIndex]] = [newConfig[newIndex], newConfig[index]];
        setFormData({ ...formData, sectionsConfig: newConfig });
    };

    const toggleSection = (index) => {
        const newConfig = [...formData.sectionsConfig];
        newConfig[index].enabled = !newConfig[index].enabled;
        setFormData({ ...formData, sectionsConfig: newConfig });
    };

    // --- Previews Logic ---
    useEffect(() => {
        if (!mainImage) {
            if (!isEditing) setMainImagePreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(mainImage);
        setMainImagePreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [mainImage, isEditing]);

    useEffect(() => {
        if (!detailImages.length) return;
        const objectUrls = detailImages.map(file => URL.createObjectURL(file));
        setDetailImagesPreviews(prev => [...prev.filter(url => !url.startsWith('blob:')), ...objectUrls]);
        return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
    }, [detailImages]);

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get('/api/projects');
            setProjects(data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchProjects(); }, []);

    const resetForm = () => {
        setFormData({
            projectId: '', title: '', category: '', client: '',
            duration: '', description: '', approach: '',
            problem: '', solution: '',
            sectionsConfig: [
                { id: 'description', enabled: true, label: 'Description' },
                { id: 'problem', enabled: false, label: 'Problem Statement' },
                { id: 'solution', enabled: false, label: 'The Solution' },
                { id: 'approach', enabled: true, label: 'Our Approach' }
            ],
            siteUrl: '',
            showGalleryFirst: true
        });
        setMainImage(null);
        setMainImage(null);
        setDetailImages([]);
        setMainImagePreview(null);
        setDetailImagesPreviews([]);
        setIsEditing(false);
        setEditingId(null);
    };

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            const data = new FormData();

            // Convert any blobs (newly selected files) in detailImagesPreviews to Base64
            const finalGallery = await Promise.all(detailImagesPreviews.map(async (url) => {
                if (url.startsWith('blob:')) {
                    const blob = await fetch(url).then(r => r.blob());
                    return await toBase64(blob);
                }
                return url; // Existing Base64 URL
            }));

            Object.keys(formData).forEach(key => {
                if (key === 'showGalleryFirst') {
                    data.append(key, formData[key] ? 'true' : 'false');
                } else if (key === 'sectionsConfig') {
                    data.append(key, JSON.stringify(formData[key]));
                } else {
                    data.append(key, formData[key]);
                }
            });

            if (mainImage) data.append('image', mainImage);
            data.append('images', JSON.stringify(finalGallery));

            if (isEditing) {
                await axios.put(`/api/projects/${editingId}`, data, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                alert('Project updated!');
            } else {
                await axios.post('/api/projects', data, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                alert('Project published!');
            }
            fetchProjects();
            resetForm();
        } catch (error) {
            const msg = sanitizeDashboardError(error);
            alert(`Save Error: ${msg}`);
            console.error(error);
        } finally { setUploading(false); }
    };

    const handleEdit = (project) => {
        setIsEditing(true);
        setEditingId(project.projectId);
        setFormData({
            projectId: project.projectId,
            title: project.title,
            category: project.category,
            client: project.client || '',
            duration: project.duration || '',
            description: project.description,
            approach: project.approach,
            problem: project.problem || '',
            solution: project.solution || '',
            sectionsConfig: project.sectionsConfig || [
                { id: 'description', enabled: true, label: 'Description' },
                { id: 'problem', enabled: false, label: 'Problem Statement' },
                { id: 'solution', enabled: false, label: 'The Solution' },
                { id: 'approach', enabled: true, label: 'Our Approach' }
            ],
            siteUrl: project.siteUrl || '',
            showGalleryFirst: project.showGalleryFirst !== undefined ? project.showGalleryFirst : true
        });
        setMainImagePreview(project.image);
        setDetailImagesPreviews(project.images || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete project?')) {
            await axios.delete(`/api/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchProjects();
        }
    };


    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <aside className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        {isEditing ? 'Edit Project' : 'New Project'}
                        {isEditing ? <ChevronRight size={18} className="text-orange-500" /> : <Plus size={18} className="text-orange-500" />}
                    </h3>
                    {isEditing && (
                        <button onClick={resetForm} className="text-[10px] uppercase font-bold text-white/30 hover:text-white">Cancel Edit</button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Unique ID" value={formData.projectId} onChange={e => setFormData({ ...formData, projectId: e.target.value })} required disabled={isEditing} title={isEditing ? "Project ID cannot be changed" : ""} />

                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Client" value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Duration" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Live URL" value={formData.siteUrl} onChange={e => setFormData({ ...formData, siteUrl: e.target.value })} />
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase font-bold text-white/30 ml-2">Banner</label>
                            <input type="file" className="text-[10px] file:bg-white/10 file:border-none file:text-white file:px-2 file:py-1 file:rounded" onChange={e => setMainImage(e.target.files[0])} required />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase font-bold text-white/30 ml-2">Gallery</label>
                            <input type="file" multiple className="text-[10px] file:bg-white/10 file:border-none file:text-white file:px-2 file:py-1 file:rounded" onChange={e => setDetailImages(Array.from(e.target.files))} />
                        </div>
                    </div>

                    {/* Previews Row */}
                    {(mainImagePreview || detailImagesPreviews.length > 0) && (
                        <div className="grid grid-cols-[150px_1fr] gap-6 p-4 bg-white/[0.02] border border-white/10 rounded-3xl animate-in zoom-in-95 duration-300">
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase font-bold text-white/30 ml-2">Banner Preview</label>
                                {mainImagePreview ? (
                                    <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black">
                                        <img src={mainImagePreview} className="w-full h-full object-cover" alt="Banner Preview" />
                                    </div>
                                ) : (
                                    <div className="aspect-square rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-[10px] text-white/20 italic">No Banner Selected</div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase font-bold text-white/30 ml-2">Gallery Preview ({detailImagesPreviews.length})</label>
                                <div className="flex flex-wrap gap-3">
                                    {detailImagesPreviews.map((url, i) => (
                                        <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0 relative group shadow-2xl">
                                            <img src={url} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1.5">
                                                <div className="flex gap-1">
                                                    <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="p-1.5 bg-white/10 hover:bg-orange-500 rounded text-[8px] disabled:opacity-20"><ChevronRight size={10} className="rotate-180" /></button>
                                                    <button type="button" onClick={() => moveImage(i, 1)} disabled={i === detailImagesPreviews.length - 1} className="p-1.5 bg-white/10 hover:bg-orange-500 rounded text-[8px] disabled:opacity-20"><ChevronRight size={10} /></button>
                                                </div>
                                                <button type="button" onClick={() => removeImage(i)} className="p-1 px-2 bg-red-500/20 hover:bg-red-500 text-[8px] rounded uppercase font-bold tracking-tighter">Remove</button>
                                            </div>
                                            <div className="absolute bottom-1 right-1 bg-black/60 px-1 rounded text-[7px] text-white/50">{i + 1}</div>
                                        </div>
                                    ))}
                                    {detailImagesPreviews.length === 0 && (
                                        <div className="h-16 w-32 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-[10px] text-white/20 italic">Gallery Empty</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="flex-1">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Layout Priority</h4>
                            <p className="text-[10px] text-white/30">Choose if the image gallery appears before or after the project details.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, showGalleryFirst: !formData.showGalleryFirst })}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.showGalleryFirst ? 'bg-orange-600/10 border-orange-500/30 text-orange-500' : 'bg-white/5 border-white/10 text-white/40'}`}
                        >
                            {formData.showGalleryFirst ? 'Gallery First' : 'Details First'}
                        </button>
                    </div>

                    {/* Section Visibility & Reordering */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/60">Section Management (Order & Visibility)</label>
                        <div className="space-y-2">
                            {formData.sectionsConfig.map((section, idx) => (
                                <div key={section.id} className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-xl">
                                    <div className="flex gap-1">
                                        <button type="button" onClick={() => moveSection(idx, -1)} disabled={idx === 0} className="p-1.5 bg-white/10 hover:bg-orange-500 rounded disabled:opacity-20"><ChevronRight size={14} className="rotate-180" /></button>
                                        <button type="button" onClick={() => moveSection(idx, 1)} disabled={idx === formData.sectionsConfig.length - 1} className="p-1.5 bg-white/10 hover:bg-orange-500 rounded disabled:opacity-20"><ChevronRight size={14} /></button>
                                    </div>
                                    <div className="flex-1 text-xs font-bold">{section.label}</div>
                                    <button
                                        type="button"
                                        onClick={() => toggleSection(idx)}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${section.enabled ? 'bg-orange-600/20 border-orange-500/40 text-orange-500' : 'bg-white/5 border-white/10 text-white/20'}`}
                                    >
                                        {section.enabled ? 'Enabled' : 'Disabled'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {formData.sectionsConfig.map((section) => {
                            if (section.id === 'description') {
                                return <textarea key="desc" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl h-24 text-xs" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                            }
                            if (section.id === 'problem') {
                                return <textarea key="prob" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl h-24 text-xs" placeholder="The Problem" value={formData.problem} onChange={e => setFormData({ ...formData, problem: e.target.value })} />
                            }
                            if (section.id === 'solution') {
                                return <textarea key="sol" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl h-24 text-xs" placeholder="The Solution" value={formData.solution} onChange={e => setFormData({ ...formData, solution: e.target.value })} />
                            }
                            if (section.id === 'approach') {
                                return <textarea key="appr" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl h-24 text-xs" placeholder="Our Approach" value={formData.approach} onChange={e => setFormData({ ...formData, approach: e.target.value })} required />
                            }
                            return null;
                        })}
                    </div>

                    <button type="submit" disabled={uploading} className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs ${uploading ? 'bg-orange-500/20' : 'bg-orange-600 hover:bg-orange-700'}`}>
                        {uploading ? 'Processing...' : isEditing ? 'Update Project' : 'Publish Project'}
                    </button>

                </form>
            </aside>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projects.map(p => (
                    <div key={p.projectId} className="p-4 rounded-3xl bg-white/[0.02] border border-white/10 group flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                            <div><h4 className="text-sm font-bold">{p.title}</h4><p className="text-[10px] text-white/40">{p.category}</p></div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => handleEdit(p)} className="p-2 text-orange-500 hover:bg-white/5 rounded-lg"><LayoutGrid size={14} /></button>
                            <button onClick={() => handleDelete(p.projectId)} className="p-2 text-red-500 hover:bg-white/5 rounded-lg"><Trash size={14} /></button>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
};

// --- CAREERS COMPONENT ---
const CareersManager = ({ token }) => {
    const [careers, setCareers] = useState([]);
    const [formData, setFormData] = useState({ title: '', department: '', location: '', type: '', experience: '', salary: '', description: '', requirements: '', responsibilities: '' });

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchCareers = async () => {
        try { const { data } = await axios.get('/api/careers'); setCareers(data); }
        catch (error) { console.error(error); }
    };

    useEffect(() => { fetchCareers(); }, []);

    const resetForm = () => {
        setFormData({ title: '', department: '', location: '', type: '', experience: '', salary: '', description: '', requirements: '', responsibilities: '' });
        setIsEditing(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                requirements: Array.isArray(formData.requirements) ? formData.requirements : formData.requirements.split(',').map(s => s.trim()),
                responsibilities: Array.isArray(formData.responsibilities) ? formData.responsibilities : formData.responsibilities.split(',').map(s => s.trim())
            };

            if (isEditing) {
                await axios.put(`/api/careers/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                alert('Job Updated!');
            } else {
                await axios.post('/api/careers', payload, { headers: { Authorization: `Bearer ${token}` } });
                alert('Job Posted!');
            }
            fetchCareers();
            resetForm();
        } catch (error) { alert('Error!'); }
    };

    const handleEdit = (career) => {
        setIsEditing(true);
        setEditingId(career.id);
        setFormData({
            title: career.title,
            department: career.department || '',
            location: career.location,
            type: career.type,
            experience: career.experience || '',
            salary: career.salary || '',
            description: career.description,
            requirements: Array.isArray(career.requirements) ? career.requirements.join(', ') : career.requirements,
            responsibilities: Array.isArray(career.responsibilities) ? career.responsibilities.join(', ') : career.responsibilities
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete job?')) {
            await axios.delete(`/api/careers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchCareers();
        }
    };

    return (
        <div className="space-y-12 animate-in slide-in-from-right duration-500">
            <aside className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        {isEditing ? 'Edit Offering' : 'Post Offering'}
                        {isEditing ? <ChevronRight size={18} className="text-orange-500" /> : <Briefcase size={18} className="text-orange-500" />}
                    </h3>
                    {isEditing && (
                        <button onClick={resetForm} className="text-[10px] uppercase font-bold text-white/30 hover:text-white">Cancel Edit</button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Job Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Dept" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} required />
                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Type (Full-time)" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Experience" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} />
                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Salary Range" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} />
                    </div>
                    <textarea className="w-full bg-white/5 border border-white/10 p-3 rounded-xl h-16 text-xs" placeholder="Brief Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    <div className="grid grid-cols-2 gap-4">
                        <textarea className="bg-white/5 border border-white/10 p-3 rounded-xl h-24 text-xs" placeholder="Requirements (comma separated)" value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} required />
                        <textarea className="bg-white/5 border border-white/10 p-3 rounded-xl h-24 text-xs" placeholder="Responsibilities (comma separated)" value={formData.responsibilities} onChange={e => setFormData({ ...formData, responsibilities: e.target.value })} required />
                    </div>
                    <button type="submit" className="w-full py-4 bg-orange-600 rounded-xl font-bold uppercase tracking-widest text-xs">
                        {isEditing ? 'Update Career Opportunity' : 'Publish Career Opportunity'}
                    </button>
                </form>
            </aside>

            <div className="space-y-3">
                {careers.map(c => (
                    <div key={c.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex justify-between items-center group">
                        <div><h4 className="font-bold">{c.title}</h4><p className="text-xs text-white/40">{c.department} • {c.location}</p></div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => handleEdit(c)} className="p-2 text-orange-500 hover:bg-white/5 rounded-lg"><Briefcase size={16} /></button>
                            <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:bg-white/5 p-2 rounded-lg transition-all"><Trash size={16} /></button>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
};

// --- BLOGS COMPONENT ---
const BlogsManager = ({ token }) => {
    const [blogs, setBlogs] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({ title: '', slug: '', category: '', excerpt: '', content: '', author: 'Vorcas Admin' });
    const [image, setImage] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchBlogs = async () => {
        try { const { data } = await axios.get('/api/blogs'); setBlogs(data); }
        catch (error) { console.error(error); }
    };
    useEffect(() => { fetchBlogs(); }, []);

    const resetForm = () => {
        setFormData({ title: '', slug: '', category: '', excerpt: '', content: '', author: 'Vorcas Admin' });
        setImage(null);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (image) data.append('image', image);

            if (isEditing) {
                await axios.put(`/api/blogs/${editingId}`, data, { headers: { Authorization: `Bearer ${token}` } });
                alert('Blog Updated!');
            } else {
                await axios.post('/api/blogs', data, { headers: { Authorization: `Bearer ${token}` } });
                alert('Daily Blog Published!');
            }
            fetchBlogs();
            resetForm();
        } catch (error) { alert('Error!'); } finally { setUploading(false); }
    };

    const handleEdit = (blog) => {
        setIsEditing(true);
        setEditingId(blog.id);
        setFormData({
            title: blog.title,
            slug: blog.slug,
            category: blog.category,
            excerpt: blog.excerpt,
            content: blog.content,
            author: blog.author || 'Vorcas Admin'
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete blog?')) {
            await axios.delete(`/api/blogs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchBlogs();
        }
    };

    return (
        <div className="space-y-12 animate-in zoom-in duration-500">
            <aside className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        {isEditing ? 'Edit Insight' : 'Daily Insight'}
                        {isEditing ? <ChevronRight size={18} className="text-orange-500" /> : <FileText size={18} className="text-orange-500" />}
                    </h3>
                    {isEditing && (
                        <button onClick={resetForm} className="text-[10px] uppercase font-bold text-white/30 hover:text-white">Cancel Edit</button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Blog Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        <input className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-sm" placeholder="Slug (no-spaces)" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required />
                        <input type="file" className="bg-white/5 border border-white/10 p-1.5 rounded-xl text-[10px] file:bg-white/10 file:text-white" onChange={e => setImage(e.target.files[0])} />
                    </div>
                    <textarea className="w-full bg-white/5 border border-white/10 p-3 rounded-xl h-16 text-xs" placeholder="Short Excerpt" value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} required />
                    <textarea className="w-full bg-white/5 border border-white/10 p-3 rounded-xl h-48 text-xs font-mono" placeholder="Full Content (Markdown or Text)" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required />
                    <button type="submit" disabled={uploading} className="w-full py-4 bg-orange-600 rounded-xl font-bold uppercase tracking-widest text-xs">
                        {uploading ? 'Processing...' : isEditing ? 'Update Post' : 'Push to Daily Feed'}
                    </button>
                </form>
            </aside>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogs.map(b => (
                    <div key={b.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-5 group">
                        <img src={b.image} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                        <div className="flex-1"><h4 className="font-bold text-sm">{b.title}</h4><p className="text-[10px] text-white/30 truncate">{b.excerpt}</p></div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => handleEdit(b)} className="p-2 text-orange-500 hover:bg-white/5 rounded-lg"><FileText size={16} /></button>
                            <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:bg-white/5 p-2 rounded-lg transition-all"><Trash size={16} /></button>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD ---
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState('projects');
    const token = localStorage.getItem('token');

    useEffect(() => { if (!token) navigate('/admin/login'); }, [token]);

    const handleLogout = () => { localStorage.removeItem('token'); navigate('/admin/login'); };

    const navItems = [
        { id: 'projects', label: 'Projects', icon: <LayoutGrid size={16} /> },
        { id: 'careers', label: 'Careers', icon: <Briefcase size={16} /> },
        { id: 'blogs', label: 'Daily Blog', icon: <FileText size={16} /> }
    ];

    return (
        <div className="min-h-screen bg-[#060606] text-white">
            {/* Sticky Top Navbar */}
            <header className="sticky top-0 z-50 bg-[#060606]/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-10">
                        <div className="group cursor-pointer">
                            <h2 className="text-xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent tracking-tighter">VORCAS </h2>
                            <p className="text-[9px] text-white/20 tracking-[2px] uppercase -mt-0.5 font-bold group-hover:text-orange-500/50 transition-colors">Admin Center</p>
                        </div>

                        {/* Horizontal Tabs */}
                        <nav className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/5">
                            {navItems.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setCurrentTab(tab.id)}
                                    className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${currentTab === tab.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'text-white/30 hover:bg-white/5 hover:text-white'}`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <p className="text-[10px] text-white/20 uppercase font-black">Authorized Personnel</p>
                            <p className="text-[9px] text-orange-500/50 italic">System Synchronized</p>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-red-500">
                            Logout <LogOut size={14} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="p-8 md:p-12 lg:p-16">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col mb-12">
                        <h3 className="text-4xl font-black uppercase tracking-tighter text-white/90">
                            Manage {currentTab} <span className="text-orange-600">.</span>
                        </h3>
                        <div className="h-1 w-20 bg-orange-600 mt-3 rounded-full"></div>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {currentTab === 'projects' && <ProjectsManager token={token} />}
                        {currentTab === 'careers' && <CareersManager token={token} />}
                        {currentTab === 'blogs' && <BlogsManager token={token} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
