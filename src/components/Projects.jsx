import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const sanitizeProjectError = (raw) => {
  let message = raw;
  if (raw?.message) {
    message = raw.message;
  }
  if (typeof message !== 'string') {
    message = JSON.stringify(message);
  }
  message = message.replace(/<[^>]+>/g, '').trim();
  if (!message || /transfer quota|data transfer quota|upgrade your plan|exceeded.*quota/i.test(message)) {
    return 'Unable to load projects. Please try again later.';
  }
  if (/^<\/?html|<!doctype html/i.test(message) || /<body|<head/i.test(message)) {
    return 'Unable to load projects. Please try again later.';
  }
  return message;
};

export default function Projects() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectImages, setProjectImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const cursorRef = useRef(null);
  const rafRef = useRef(null);

  const [error, setError] = useState('');

  const fetchProjectImage = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/image`);
      if (response.ok) {
        // Handle both binary image and JSON responses
        const contentType = response.headers.get('content-type');
        let imageUrl;
        
        if (contentType && contentType.includes('image/')) {
          // Binary image response - convert to blob URL
          const blob = await response.blob();
          imageUrl = URL.createObjectURL(blob);
        } else {
          // JSON response with BASE64 data
          const data = await response.json();
          imageUrl = data.image;
        }
        
        setProjectImages(prev => ({ ...prev, [projectId]: imageUrl }));
      }
    } catch (err) {
      console.error(`Failed to load image for project ${projectId}:`, err);
    }
  };

  const fetchProjects = async (page = 1) => {
    try {
      const response = await fetch(`/api/projects?page=${page}&limit=12`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText || 'Failed to load projects');
      }

      const data = await response.json();

      if (data.projects && Array.isArray(data.projects)) {
        const mapped = data.projects.map(p => ({
          ...p,
          id: p.projectId
        }));
        
        if (page === 1) {
          setProjects(mapped);
        } else {
          setProjects(prev => [...prev, ...mapped]);
        }
        
        setTotalPages(data.totalPages);
        setCurrentPage(page);
        
        // Fetch images for all projects
        mapped.forEach(project => {
          if (!projectImages[project.id]) {
            fetchProjectImage(project.id);
          }
        });
        
        if (mapped.length === 0 && page === 1) {
          setError('No projects found yet.');
        }
      } else {
        setError('Unexpected response from the projects API.');
      }
    } catch (renderError) {
      console.error('Error fetching projects from backend:', renderError);
      setError(sanitizeProjectError(renderError));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProjects(1);

    const handleMouseMove = (e) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      setLoadingMore(true);
      fetchProjects(currentPage + 1);
    }
  };

  return (
    <div id="projects" className="w-full bg-black text-white pt-20 md:pt-28 pb-12 md:pb-16 px-6 md:px-12 scroll-mt-24">

      {/* Custom Cursor Overlay */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        style={{
          transform: 'translate3d(0, 0, 0) translate(-50%, -50%)',
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
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Projects</h2>
          <p className="text-white/60 text-[0.95rem] md:text-base max-w-xl mx-auto md:mx-0">
            A showcase of our premium projects. Minimalist aesthetics and high end execution.
          </p>
        </div>

        {!loading && error && (
          <div className="mb-8 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {[1, 2, 3, 4, 5, 6].map((placeholder) => (
              <div key={placeholder} className="animate-pulse rounded-3xl bg-white/[0.03] p-6 h-80" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group cursor-none flex flex-col mx-auto w-full max-w-[450px] sm:max-w-none"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => navigate(`/projects/${project.id}`, { state: { project } })}
                >
                <div className="relative w-full aspect-video rounded-2xl md:rounded-3xl overflow-hidden mb-4 bg-white/5 shadow-lg">
                    {projectImages[project.id] ? (
                      <img
                        src={projectImages[project.id]}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full animate-pulse bg-white/10" />
                    )}
                  </div>
                  <div className="px-2">
                    <span className="block text-white/50 text-xs mb-1.5">{project.category}</span>
                    <h3 className="text-lg md:text-xl font-bold transition-colors group-hover:text-orange-500">{project.title}</h3>
                  </div>
                </div>
              ))}
            </div>
            
            {currentPage < totalPages && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? 'Loading...' : 'Load More Projects'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
