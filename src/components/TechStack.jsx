import React from "react";
import {
  SiFlutter,
  SiFigma,
  SiReact,
  SiAndroid,
  SiApple,
  SiMongodb,
  SiNodedotjs,
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiSpringboot,
  SiTailwindcss,
  SiBootstrap,
  SiFramer,
  SiGit,
  SiMysql,
  SiDocker
} from "react-icons/si";

import { FaJava, FaAws } from "react-icons/fa";

const MiroIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className="relative z-2"
  >
    <rect width="100" height="100" rx="18" fill="#F9D806" />
    <text
      x="50%"
      y="58%"
      textAnchor="middle"
      fontSize="55"
      fontWeight="800"
      fill="black"
      fontFamily="Arial"
    >
      M
    </text>
  </svg>
);

const TechCard = ({ t }) => (
  <div className="relative group flex flex-col items-center justify-center gap-3 cursor-pointer py-4 mx-12 transition-all duration-500 hover:scale-110 hover:-translate-y-1">
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none scale-150"
      style={{
        background: `radial-gradient(circle at center, ${t.brandColor}20 0%, transparent 70%)`
      }}
    />
    
    <div className="text-4xl md:text-5xl relative z-10 transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(255_255_255_/_0.3)] shadow-current" style={{ color: t.brandColor }}>
      {t.icon}
    </div>
    
    <p className="text-zinc-300 group-hover:text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] relative z-10 transition-colors duration-500 group-hover:opacity-100">
      {t.name}
    </p>
  </div>
);

export default function TechStack() {
  const techRow1 = [
    { name: "Java", brandColor: "#5382A1", icon: <FaJava /> },
    { name: "JavaScript", brandColor: "#F7DF1E", icon: <SiJavascript /> },
    { name: "TypeScript", brandColor: "#3178C6", icon: <SiTypescript /> },
    { name: "React", brandColor: "#61DAFB", icon: <SiReact /> },
    { name: "Next.js", brandColor: "#FFFFFF", icon: <SiNextdotjs /> },
    { name: "Flutter", brandColor: "#02569B", icon: <SiFlutter /> },
    { name: "iOS/Android", brandColor: "#FFFFFF", icon: <SiAndroid className="text-[#3DDC84]" /> },
    { name: "Node JS", brandColor: "#8CC84B", icon: <SiNodedotjs /> },
    { name: "Spring Boot", brandColor: "#6DB33F", icon: <SiSpringboot /> },
  ];

  const techRow2 = [
    { name: "MySQL", brandColor: "#00758F", icon: <SiMysql /> },
    { name: "MongoDB", brandColor: "#47A248", icon: <SiMongodb /> },
    { name: "AWS", brandColor: "#FF9900", icon: <FaAws /> },
    { name: "Tailwind", brandColor: "#06B6D4", icon: <SiTailwindcss /> },
    { name: "Bootstrap", brandColor: "#7952B3", icon: <SiBootstrap /> },
    { name: "Figma", brandColor: "#F24E1E", icon: <SiFigma /> },
    { name: "Framer", brandColor: "#0055FF", icon: <SiFramer /> },
    { name: "Docker", brandColor: "#2496ED", icon: <SiDocker /> },
    { name: "Git", brandColor: "#F05032", icon: <SiGit /> },
  ];

  return (
    <section className="w-full bg-black py-24 overflow-hidden scroll-mt-24" id="tech-stack">

      <div className="max-w-6xl mx-auto px-6 mb-20 text-center md:text-left">
        <div className="reveal-up inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.2em] text-orange-500 uppercase mb-6">
          Our Capabilities
        </div>
        <h2 className="reveal-up delay-100 text-white text-4xl md:text-6xl font-black tracking-tighter">
          High-Performance <span className="text-orange-600">Tech Stack</span>
        </h2>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex overflow-hidden group">
          <div className="flex whitespace-nowrap animate-ticker">
            {[...techRow1, ...techRow1].map((t, i) => (
              <TechCard key={i} t={t} />
            ))}
          </div>
        </div>

        <div className="flex overflow-hidden group">
          <div className="flex whitespace-nowrap animate-ticker-reverse">
            {[...techRow2, ...techRow2].map((t, i) => (
              <TechCard key={i} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
