import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Github, Database, Terminal, ArrowUpRight, TrendingUp
} from 'lucide-react';
import {
  SiReact, SiNextdotjs, SiTailwindcss, SiNodedotjs,
  SiTypescript, SiFlutter, SiAndroid, SiApple,
  SiFirebase, SiPostgresql, SiDocker, SiFigma, SiFramer,
  SiGoogleanalytics, SiOpenai, SiPython, SiMongodb
} from 'react-icons/si';
import { FaAws, FaChartLine, FaRobot } from 'react-icons/fa';

const serviceData = [
  {
    id: "01",
    title: "UX/UI Design",
    desc: "End-to-end product design—from research and UX flows to polished UI systems and developer-ready handoff.",
    glow: "rgba(251, 106, 9, 0.4)", // Orange glow
    services: ["User Research & Strategy", "UX Flows & Wireframes", "UI Systems & Prototypes", "Design Ops & Dev Handoff"],
    tools: [<SiReact />, <SiTailwindcss />, <SiFigma size={18} />, <Github size={18} />, <Terminal size={18} />]
  },
  {
    id: "02",
    title: "Web Development",
    desc: "Robust, scalable products across web and mobile—from elegant UIs to reliable APIs and automated DevOps.",
    glow: "rgba(251, 106, 9, 0.4)",
    services: ["Frontend (React / Next)", "Backend APIs (Node)", "E-commerce & Headless", "CI/CD & Cloud Ops"],
    tools: [<SiReact />, <SiNextdotjs />, <SiNodedotjs />, <SiTypescript />, <SiDocker />]
  },
  {
    id: "03",
    title: "App Solutions",
    desc: "Custom high-performance mobile applications that offer a seamless native experience for Android and iOS.",
    glow: "rgba(251, 106, 9, 0.4)",
    services: ["Native Android / iOS", "Flutter Development", "React Native Apps", "App Store Optimization"],
    tools: [<SiFlutter />, <SiAndroid />, <SiApple />, <SiFirebase />, <FaAws />]
  },
  {
    id: "04",
    title: "Digital Marketing",
    desc: "Driving growth with research-backed strategies and campaigns that skyrocket your online presence.",
    glow: "rgba(251, 106, 9, 0.4)",
    services: ["SEO & Content Strategy", "Performance Marketing", "Social Media Growth", "Data Analytics & CRO"],
    tools: [<SiGoogleanalytics />, <FaChartLine size={18} />, <TrendingUp size={18} />]
  },
  {
    id: "05",
    title: "Custom Software",
    desc: "Building bespoke, scalable ERP and CRM solutions to completely streamline your business operations.",
    glow: "rgba(251, 106, 9, 0.4)",
    services: ["ERP & CRM Systems", "Admin Dashboards", "Database Architecture", "Cloud Migration"],
    tools: [<SiPostgresql />, <SiMongodb />, <FaAws />, <Terminal size={18} />]
  },
  {
    id: "06",
    title: "AI & Automation",
    desc: "Leverage machine learning and automated workflows to accelerate your efficiency and precision.",
    glow: "rgba(251, 106, 9, 0.4)",
    services: ["AI Model Integration", "Automated Workflows", "Chatbot Solutions", "Data Automation"],
    tools: [<FaRobot />, <SiOpenai />, <SiPython />, <SiNodedotjs />]
  }
];

const Services = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-91%"]);

  return (
    <section ref={targetRef} className="relative h-[700vh] bg-black scroll-mt-24" id="ourservice">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">

        {/* Left Column: Fixed Content */}
        <div className="absolute top-0 left-0 w-full md:w-[32%] h-full bg-black z-30 flex flex-col justify-center px-6 md:px-12 lg:px-20 md:shadow-[60px_0_90px_-20px_rgba(0,0,0,1)]">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter mb-8 max-w-sm leading-tight">
            <span className="text-orange-500">O</span>ur <span className="text-orange-500">S</span>ervices
          </h2>
          <p className="text-white/40 text-lg md:text-xl max-w-sm leading-relaxed">
            We offer comprehensive digital solutions that transform your business and drive innovation across every touchpoint.
          </p>

          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[500px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none" />
        </div>

        {/* Animated Horizontal Track */}
        <motion.div style={{ x }} className="flex gap-6 pl-[100vw] md:pl-[38%] pr-32 z-10 pt-4 md:pt-6 lg:pt-10">
          {serviceData.map((service) => (
            <div
              key={service.id}
              className="group flex-shrink-0 w-[85vw] md:w-[380px] lg:w-[460px] h-[450px] md:h-[500px] lg:h-[580px] rounded-[32px] p-6 md:p-8 lg:p-10 flex flex-col justify-between overflow-hidden relative service-card-premium shadow-2xl"
            >
              {/* Glow Effect on Top */}
              <div 
                className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500 z-50"
              />
              <div 
                className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-20 bg-orange-600/20 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              />

              {/* Dot Pattern Background */}
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 dot-pattern opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none z-0" />

              {/* Top Row: ID and Arrow */}
              <div className="flex justify-between items-start relative z-10 w-full">
                <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-none tracking-tighter">
                  {service.id}
                </div>

                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white/40 group-hover:text-white transition-all duration-500">
                  <ArrowUpRight size={32} strokeWidth={1.5} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                </div>
              </div>

              {/* Bottom Section: Title and Content */}
              <div className="relative z-10 mt-auto">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-orange-400 transition-colors duration-500"
                >
                  {service.title}
                </motion.h3>
                
                {/* Auto-appearing Content Container */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="mt-2"
                >
                  <p className="text-white/60 text-sm md:text-base lg:text-lg mb-8 leading-relaxed max-w-[90%] font-medium">
                    {service.desc}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-auto">
                    <div>
                      <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Capabilities</p>
                      <ul className="grid grid-cols-1 gap-y-2.5">
                        {service.services.slice(0, 4).map((s, i) => (
                          <li key={i} className="flex items-center gap-2 text-[11px] lg:text-[15px] text-white/90 font-semibold whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 shadow-[0_0_8px_rgba(251,106,9,0.5)]" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Tech Stack</p>
                      <div className="flex flex-wrap gap-3 lg:gap-4 text-xl lg:text-3xl text-white/60">
                        {service.tools.map((tool, i) => (
                          <div key={i} className="hover:text-orange-400 hover:scale-110 transition-all duration-300">
                            {tool}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Backglow for hover depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-orange-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
