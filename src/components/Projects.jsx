import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Projects() {
  const navigate = useNavigate();
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');
        const dynamicProjects = await response.json();
        
        if (Array.isArray(dynamicProjects)) {
            const mapped = dynamicProjects.map(p => ({
                ...p,
                id: p.projectId // Mapping backend projectId to frontend id
            }));
            setProjects(mapped);
        }
      } catch (error) {
        console.error("Error fetching projects from backend:", error);
      }
    };

    fetchProjects();

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div id="projects" className="w-full bg-black text-white pt-20 md:pt-28 pb-12 md:pb-16 px-6 md:px-12 scroll-mt-24">

      {/* Custom Cursor Overlay */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        style={{
          transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        <div className="bg-white text-black pl-5 pr-2 py-2 rounded-full flex items-center gap-3 shadow-xl backdrop-blur-md">
          <span className="text-sm font-semibold whitespace-nowrap">View Project</span>
          <div className="bg-black text-white p-2 rounded-full">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Projects</h1>
          <p className="text-white/60 text-[0.95rem] md:text-base max-w-xl mx-auto md:mx-0">
            A showcase of our premium projects. Minimalist aesthetics and high end execution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group cursor-none flex flex-col mx-auto w-full max-w-[450px] sm:max-w-none"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="relative w-full aspect-video rounded-2xl md:rounded-3xl overflow-hidden mb-4 bg-white/5 shadow-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="px-2">
                <span className="block text-white/50 text-xs mb-1.5">{project.category}</span>
                <h3 className="text-lg md:text-xl font-bold transition-colors group-hover:text-orange-500">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
