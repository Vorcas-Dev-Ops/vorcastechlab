import React from 'react';
import { Link } from 'react-router-dom';
import Particles from './Particles';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative bg-bg z-[20]" id="hero-section">


      {/* Background Particles */}
      <Particles />

      {/* Center Rotating Orbs & Glow */}
      <div className="hero-glow-container">
        <div className="hero-orb orb-1"></div>
        <div className="hero-orb orb-2"></div>
        <div className="hero-orb orb-3"></div>
        <div className="hero-orb orb-4"></div>
        <div className="hero-glow-core"></div>
      </div>

      <div className="text-center z-10 max-w-[1100px] px-6 md:px-8">
        {/* Badge */}
        <div className="reveal-up">
          <div className="section-badge inline-flex items-center gap-2">
            <span className="badge-dot"></span>
            <span className="bg-accent px-2 py-0.5 rounded text-[10px] font-bold uppercase">New</span>
            <span>Next-Gen Software Solutions</span>
          </div>
        </div>
 
        <h1 className="text-[clamp(2.5rem,4vw,5.5rem)] lg:text-[clamp(2.5rem,5vw,6.5rem)] font-bold tracking-tight mb-6 leading-[1.1] reveal-up delay-100">
          Engineering the Future of <br />
          <span className="bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
            Digital Innovation.
          </span>
        </h1>
 
        <p className="text-[clamp(1.1rem,1.5vw,1.1rem)] text-white/40 mb-10 reveal-up delay-200 max-w-[700px] mx-auto leading-relaxed">
          Vorcas TechLab builds powerful web solutions, mobile apps, and custom software designed for high-performance scale and impact.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center reveal-up delay-300">
          <button 
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3.5 rounded-full font-bold bg-white text-black transition-all duration-300 hover:scale-105 hover:bg-orange-500 hover:text-white flex items-center justify-center gap-2 shadow-xl shadow-white/5"
          >
            Get in touch
            <svg width="15" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </button>
          <button 
            onClick={() => {
              const id = window.innerWidth < 768 ? "ourservice" : "ourservice-desktop";
              document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 rounded-full font-bold bg-[#fb6a09]/10 border border-orange-500/30 text-white transition-all duration-300 hover:bg-orange-600 hover:border-orange-600 hover:scale-105 flex items-center justify-center shadow-lg"
          >
            View services
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero;
