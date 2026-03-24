import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const projectDetails = {
  rently: {
    title: 'Rently - Real Estate Website',
    category: 'Web Design',
    client: 'Rently Inc.',
    duration: '2 weeks',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542744094-24638ea0b3b5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80'
    ],
    description: `Rently is a premium real estate and hospitality template built in React, crafted for property managers, boutique agencies, and hosts who want to showcase exceptional stays through design, storytelling, and seamless presentation.`,
    approach: `Rently was created with a clear purpose — to transform how real estate is experienced online. My approach blends visual storytelling, precision layout systems, and human-centered design principles to create a platform that feels as sophisticated as the properties it showcases. Rently doesn’t just list spaces — it evokes a sense of place, helping users imagine life within them.`,
    siteUrl: 'https://rently-realestate.netlify.app'
  },
  // Add fallback or other items
  default: {
    title: 'Premium Web Project',
    category: 'Web Design',
    client: 'Vorcas TechLab',
    duration: '4 weeks',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542744094-24638ea0b3b5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80'
    ],
    description: `A stunning premium web experience crafted to perfection.`,
    approach: `This project focuses on visual storytelling and dynamic motion to create an unforgettable user experience that converts and engages.`,
    siteUrl: 'https://vorcas.com'
  }
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ once: true, duration: 800, easing: 'ease-out-cubic' });

    const getProject = async () => {
        setLoading(true);
        // Check Static first
        if (projectDetails[id]) {
            setData(projectDetails[id]);
            setLoading(false);
            return;
        }

        // Fetch Dynamic
        try {
            const res = await fetch(`http://localhost:5000/api/projects/${id}`);
            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else {
                setData(projectDetails.default);
            }
        } catch (err) {
            setData(projectDetails.default);
        } finally {
            setLoading(false);
        }
    };

    getProject();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6 md:px-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header Block */}
        <div className="flex flex-col items-center justify-center text-center relative mb-16">
          <button
            onClick={() => navigate('/projects')}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors bg-white/5 py-2 px-4 rounded-full border border-white/10"
            data-aos="fade-right"
          >
            <ArrowLeft size={16} /> Back to Projects
          </button>
          <h1 className="text-4xl md:text-5xl font-bold" data-aos="fade-down">{data.title}</h1>
        </div>
        {/* Dynamic Content Ordering */}
        {(() => {
          const GallerySection = (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20" key="gallery">
              {data.images && Array.isArray(data.images) && data.images.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-[2rem] bg-white/5"
                  data-aos="fade-up"
                  data-aos-delay={idx * 150}
                >
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          );

          const DetailsSection = (
            <div className="flex flex-col md:flex-row gap-16 lg:gap-32 mb-20" key="details">
              {/* Left Metadata Column */}
              <div className="md:w-[250px] shrink-0" data-aos="fade-right" data-aos-delay="300">
                <div className="space-y-4 text-sm mb-10">
                  <div className="grid grid-cols-[100px_1fr] border-b border-white/10 pb-4">
                    <span className="text-white/50">Category:</span>
                    <span className="font-medium text-right">{data.category}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] border-b border-white/10 pb-4">
                    <span className="text-white/50">Client:</span>
                    <span className="font-medium text-right">{data.client}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] border-b border-white/10 pb-4">
                    <span className="text-white/50">Duration:</span>
                    <span className="font-medium text-right">{data.duration}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <a 
                    href={data.siteUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative flex justify-center items-center text-zinc-600 text-sm font-bold w-full"
                  >
                    {/* Tooltip */}
                    <div className="absolute opacity-0 group-hover:opacity-100 group-hover:-translate-y-[150%] -translate-y-[300%] duration-500 group-hover:delay-500 skew-y-[20deg] group-hover:skew-y-0 shadow-md">
                      <div className="bg-lime-200 flex items-center gap-1 p-2 rounded-md">
                        <svg fill="none" viewBox="0 0 24 24" height="18px" width="18px" xmlns="http://www.w3.org/2000/svg" className="stroke-zinc-600">
                          <circle strokeLinejoin="round" r="9" cy="12" cx="12"></circle>
                          <path strokeLinejoin="round" d="M12 3C12 3 8.5 6 8.5 12C8.5 18 12 21 12 21"></path>
                          <path strokeLinejoin="round" d="M12 3C12 3 15.5 6 15.5 12C15.5 18 12 21 12 21"></path>
                          <path strokeLinejoin="round" d="M3 12H21"></path>
                          <path strokeLinejoin="round" d="M19.5 7.5H4.5"></path>
                          <path strokeLinejoin="round" d="M19.5 16.5H4.5"></path>
                        </svg>
                        <span>Vorcas Techlab</span>
                      </div>
                      <div className="shadow-md bg-lime-200 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 rotate-45 p-1"></div>
                    </div>

                    {/* Main Button */}
                    <div className="shadow-md flex items-center justify-center bg-gradient-to-br from-lime-200 to-yellow-200 p-3 rounded-full cursor-pointer duration-500 w-full group/btn relative z-10 overflow-hidden">
                      <div className="flex items-center gap-2 shrink-0 group-hover:w-0 group-hover:opacity-0 transition-all duration-500 overflow-hidden">
                        <span className="text-zinc-600 font-bold uppercase tracking-wider text-[10px] md:text-xs text-center">Preview</span>
                        <svg fill="none" viewBox="0 0 24 24" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" className="fill-zinc-600">
                          <path strokeLinejoin="round" strokeLinecap="round" d="M15.4306 7.70172C7.55045 7.99826 3.43929 15.232 2.17021 19.3956C2.07701 19.7014 2.31139 20 2.63107 20C2.82491 20 3.0008 19.8828 3.08334 19.7074C6.04179 13.4211 12.7066 12.3152 15.514 12.5639C15.7583 12.5856 15.9333 12.7956 15.9333 13.0409V15.1247C15.9333 15.5667 16.4648 15.7913 16.7818 15.4833L20.6976 11.6784C20.8723 11.5087 20.8993 11.2378 20.7615 11.037L16.8456 5.32965C16.5677 4.92457 15.9333 5.12126 15.9333 5.61253V7.19231C15.9333 7.46845 15.7065 7.69133 15.4306 7.70172Z"></path>
                        </svg>
                      </div>
                      <span className="text-[0px] group-hover:text-sm group-hover:ml-2 group-hover/btn:text-sm duration-500 whitespace-nowrap overflow-hidden transition-all uppercase tracking-wider font-bold text-zinc-600">Check Out the Website</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right Content Column */}
              <div className="flex-1" data-aos="fade-up" data-aos-delay="400">
                <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed mb-12">{data.description}</p>
                <h3 className="text-3xl font-bold mb-6">My Approach</h3>
                <p className="text-white/60 text-lg leading-relaxed mb-8">{data.approach}</p>
              </div>
            </div>
          );

          return data.showGalleryFirst !== false 
            ? [GallerySection, DetailsSection] 
            : [DetailsSection, GallerySection];
        })()}
      </div>
    </div>
  );
}
