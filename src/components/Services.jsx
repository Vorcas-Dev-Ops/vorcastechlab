import React, { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useAnimation } from 'framer-motion';
import {
  Github, Database, Terminal, ArrowUpRight, TrendingUp, ChevronLeft, ChevronRight
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

/* ─── Mobile Swipe Card ───────────────────────────────────────────────── */
const ServiceCard = ({ service }) => (
  <div className="group flex-shrink-0 w-full h-full rounded-[28px] p-6 flex flex-col justify-between overflow-hidden relative service-card-premium shadow-2xl">
    {/* Top glow line */}
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-40 z-50" />

    {/* Dot pattern */}
    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 dot-pattern opacity-25 pointer-events-none z-0" />

    {/* ID + Arrow */}
    <div className="flex justify-between items-start relative z-10 w-full">
      <div className="text-5xl font-bold text-white leading-none tracking-tighter">
        {service.id}
      </div>
      <div className="w-10 h-10 flex items-center justify-center text-white/40">
        <ArrowUpRight size={28} strokeWidth={1.5} />
      </div>
    </div>

    {/* Bottom section */}
    <div className="relative z-10 mt-auto">
      <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
        {service.title}
      </h3>
      <p className="text-white/60 text-sm mb-6 leading-relaxed font-medium">
        {service.desc}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em] mb-3">Capabilities</p>
          <ul className="grid grid-cols-1 gap-y-2">
            {service.services.slice(0, 4).map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-[11px] text-white/90 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 shadow-[0_0_8px_rgba(251,106,9,0.5)]" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em] mb-3">Tech Stack</p>
          <div className="flex flex-wrap gap-3 text-xl text-white/60">
            {service.tools.map((tool, i) => (
              <div key={i} className="hover:text-orange-400 transition-colors duration-300">{tool}</div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Backglow */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-orange-900/10 pointer-events-none" />
  </div>
);

/* ─── Mobile Carousel ────────────────────────────────────────────────── */
const MobileServicesCarousel = () => {
  const [current, setCurrent] = useState(0);
  const total = serviceData.length;
  const dragX = useMotionValue(0);
  const controls = useAnimation();

  const goTo = useCallback((index) => {
    const clamped = Math.max(0, Math.min(total - 1, index));
    setCurrent(clamped);
    controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } });
    dragX.set(0);
  }, [total, controls, dragX]);

  const onDragEnd = (_, info) => {
    const THRESHOLD = 60;
    if (info.offset.x < -THRESHOLD || info.velocity.x < -400) {
      goTo(current + 1);
    } else if (info.offset.x > THRESHOLD || info.velocity.x > 400) {
      goTo(current - 1);
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 35 } });
    }
  };

  return (
    <div className="w-full flex flex-col" style={{ paddingBottom: '2rem' }}>
      {/* Header */}
      <div className="px-6 mb-8 mt-[-10px]">
        <h2 className="text-4xl font-black text-white tracking-tighter mb-3 leading-tight">
          <span className="text-orange-500">O</span>ur <span className="text-orange-500">S</span>ervices
        </h2>
        <p className="text-white/40 text-sm leading-relaxed">
          Comprehensive digital solutions that transform your business across every touchpoint.
        </p>
      </div>

      {/* Carousel viewport */}
      <div className="relative overflow-hidden px-5" style={{ height: '420px' }}>
        {/* Prev / Next ghost buttons */}
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 disabled:opacity-20 transition-all duration-200 active:scale-90"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 disabled:opacity-20 transition-all duration-200 active:scale-90"
        >
          <ChevronRight size={18} />
        </button>

        {/* Draggable strip */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          style={{ x: dragX, touchAction: 'pan-y' }}
          animate={controls}
          onDragEnd={onDragEnd}
          className="relative w-full h-full cursor-grab active:cursor-grabbing"
        >
          {serviceData.map((service, index) => {
            const offset = index - current;
            return (
              <motion.div
                key={service.id}
                animate={{
                  scale: offset === 0 ? 1 : 0.88,
                  x: `${offset * 102}%`,
                  opacity: Math.abs(offset) <= 1 ? (offset === 0 ? 1 : 0.45) : 0,
                  zIndex: offset === 0 ? 10 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-0 mx-8 pointer-events-none select-none"
              >
                <ServiceCard service={service} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {serviceData.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? '24px' : '7px',
              height: '7px',
              background: i === current ? '#f97316' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      {/* Card counter */}
      <p className="text-center text-white/20 text-xs mt-3 font-mono tracking-widest">
        {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </p>
    </div>
  );
};

/* ─── Main Section ───────────────────────────────────────────────────── */
const Services = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-91%"]);

  return (
    <>
      {/* ── MOBILE (< md) ── plain scroll section with swipe carousel */}
      <section className="block md:hidden bg-black py-16 pt-24" id="ourservice">
        <MobileServicesCarousel />
      </section>

      {/* ── DESKTOP (≥ md) ── original scroll-driven horizontal track */}
      <section ref={targetRef} className="relative h-[700vh] bg-black scroll-mt-24 hidden md:block" id="ourservice-desktop">
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
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500 z-50" />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-20 bg-orange-600/20 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 dot-pattern opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none z-0" />

                <div className="flex justify-between items-start relative z-10 w-full">
                  <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-none tracking-tighter">
                    {service.id}
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white/40 group-hover:text-white transition-all duration-500">
                    <ArrowUpRight size={32} strokeWidth={1.5} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                  </div>
                </div>

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

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-orange-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Services;

