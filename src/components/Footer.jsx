import React, { useRef } from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

/* ── Animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};
 
const bigTextVariant = {
  hidden: { y: "105%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
  },
};

export default function Footer() {
  const footerRef = useRef(null);
  /* once:true → fires only the first time the footer enters view */
  const inView = useInView(footerRef, { once: false, amount: 0.1 });

  return (
    <div className="relative md:sticky bottom-0 z-10 w-full overflow-hidden pointer-events-auto">
      <footer 
        ref={footerRef}
        className="relative bg-orange-600 text-white pt-8 sm:pt-16 pb-4 sm:pb-6 px-6 md:px-12 lg:px-24 flex flex-col min-h-fit sm:min-h-[50vh] justify-between"
      >
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center w-full">
          {/* ────── DESKTOP VIEW ─────────────────────────────────────── */}
          <div className="hidden md:flex flex-col items-center w-full">
            {/* LOGO + SOCIAL */}
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-row items-center justify-center gap-6 lg:gap-10 mb-8"
            >
              <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
                Vorcas Tech<span className="text-black">Lab</span>
              </h2>

              <div className="flex gap-4 lg:gap-6 mt-0">
                <a href="https://www.linkedin.com/company/vorcas-tech-lab/" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" className="bg-white/10 hover:bg-white/20 p-2.5 lg:p-3 rounded-lg transition">
                  <Linkedin className="w-5 h-5 lg:w-7 lg:h-7" />
                </a>
                <a href="https://facebook.com" aria-label="Facebook" className="bg-white/10 hover:bg-white/20 p-2.5 lg:p-3 rounded-lg transition">
                  <Facebook className="w-5 h-5 lg:w-7 lg:h-7" />
                </a>
                <a href="https://www.instagram.com/vorcas.tech.lab/" aria-label="Instagram" className="bg-white/10 hover:bg-white/20 p-2.5 lg:p-3 rounded-lg transition">
                  <Instagram className="w-5 h-5 lg:w-7 lg:h-7" />
                </a>
              </div>
            </motion.div>

            {/* GRID LINKS */}
            <motion.div
              variants={fadeUp}
              custom={0.18}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="grid grid-cols-3 gap-8 lg:gap-12 text-center max-w-5xl w-full mb-8"
            >
              {/* COMPANY */}
              <div className="flex flex-col items-center">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 text-black">Company</h3>
                <ul className="space-y-3 text-base lg:text-lg">
                  <li><Link to="/about" className="hover:text-black transition-colors">About Us</Link></li>
                  <li><Link to="/careers" className="hover:text-black transition-colors">Careers</Link></li>
                  <li><Link to="/contact" className="hover:text-black transition-colors">Contact</Link></li>
                </ul>
              </div>

              {/* SERVICES */}
              <div className="flex flex-col items-center">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 text-black">Services</h3>
                <ul className="space-y-3 text-base lg:text-lg">
                  <li className="hover:text-black transition-colors cursor-pointer">Web Development</li>
                  <li className="hover:text-black transition-colors cursor-pointer">Mobile Apps</li>
                  <li className="hover:text-black transition-colors cursor-pointer">E-Commerce</li>
                  <li className="hover:text-black transition-colors cursor-pointer">UI/UX Design</li>
                </ul>
              </div>

              {/* RESOURCES */}
              <div className="flex flex-col items-center">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 text-black">Resources</h3>
                <ul className="space-y-3 text-base lg:text-lg">
                  <li><Link to="/projects" className="hover:text-black transition-colors">Projects</Link></li>
                  <li className="hover:text-black transition-colors cursor-pointer">Testimonials</li>
                  <li className="hover:text-black transition-colors cursor-pointer">FAQs</li>
                  <li><Link to="/contact" className="hover:text-black transition-colors">Support</Link></li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* ────── MOBILE VIEW ─────────────────────────────────────── */}
          <div className="flex md:hidden flex-col items-center w-full">
            {/* LOGO */}
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-col items-center gap-4 mb-10"
            >
              <h2 className="text-[28px] font-bold tracking-tight">
                Vorcas Tech<span className="text-black">Lab</span>
              </h2>

              <div className="flex gap-4">
                <a href="https://www.linkedin.com/company/vorcas-tech-lab/" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" className="bg-white/10 p-3 rounded-xl">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="https://facebook.com" aria-label="Facebook" className="bg-white/10 p-3 rounded-xl">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/vorcas.tech.lab/" aria-label="Instagram" className="bg-white/10 p-3 rounded-xl">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </motion.div>

            {/* GRID LINKS FOR MOBILE  */}
            <motion.div
              variants={fadeUp}
              custom={0.18}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="grid grid-cols-3 gap-x-2 gap-y-12 text-center w-full mb-10"
            >
              {/* COMPANY */}
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-extrabold mb-4 text-black underline decoration-2 underline-offset-8">Company</h3>
                <ul className="space-y-3 text-[10px] font-medium leading-tight">
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>

              {/* SERVICES */}
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-extrabold mb-4 text-black underline decoration-2 underline-offset-8">Services</h3>
                <ul className="space-y-3 text-[10px] font-medium leading-tight">
                  <li>Web Development</li>
                  <li>Mobile Apps</li>
                  <li>E-Commerce</li>
                  <li>UI/UX Design</li>
                </ul>
              </div>

              {/* RESOURCES */}
              <div className="flex flex-col items-center pt-0">
                <h3 className="text-sm font-extrabold mb-4 text-black underline decoration-2 underline-offset-8">Resources</h3>
                <ul className="space-y-3 text-[10px] font-medium leading-tight">
                  <li><Link to="/projects">Projects</Link></li>
                  <li>Testimonials</li>
                  <li>FAQs</li>
                  <li><Link to="/contact">Support</Link></li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BIG BACKGROUND TEXT — Responsive size */}
        <div className="overflow-hidden w-full mt-4">
          <motion.h1
            variants={bigTextVariant}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="w-full text-center leading-none text-[20vw] md:text-[15vw] font-extrabold text-white/100 tracking-tight pointer-events-none select-none"
          >
            VORCAS
          </motion.h1>
        </div>

        {/* COPYRIGHT */}
        <motion.div
          variants={fadeUp}
          custom={0.5}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center text-black text-xs sm:text-sm lg:text-lg mt-4"
        >
          © {new Date().getFullYear()} Vorcas TechLab — All Rights Reserved.
        </motion.div>
      </footer>
    </div>
  );
}
