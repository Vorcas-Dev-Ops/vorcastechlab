import React, { useRef, useState, useEffect } from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

function useInViewOnce(ref) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}

export default function Footer() {
  const footerRef = useRef(null);
  const inView = useInViewOnce(footerRef);

  return (
    <div className="relative md:sticky bottom-0 z-10 w-full overflow-hidden pointer-events-auto">
      <footer 
        ref={footerRef}
        className="relative bg-orange-600 text-white pt-8 sm:pt-16 pb-4 sm:pb-6 px-6 md:px-12 lg:px-24 flex flex-col min-h-fit sm:min-h-[50vh] justify-between"
      >
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center w-full">
          {/* DESKTOP VIEW */}
          <div className="hidden md:flex flex-col items-center w-full">
            {/* LOGO + SOCIAL */}
            <div className={`flex flex-row items-center justify-center gap-6 lg:gap-10 mb-8 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
            </div>

            {/* GRID LINKS */}
            <div className={`grid grid-cols-3 gap-8 lg:gap-12 text-center max-w-5xl w-full mb-8 transition-all duration-700 delay-150 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
            </div>
          </div>

          {/* MOBILE VIEW */}
          <div className="flex md:hidden flex-col items-center w-full">
            {/* LOGO */}
            <div className={`flex flex-col items-center gap-4 mb-10 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
            </div>

            {/* GRID LINKS FOR MOBILE  */}
            <div className={`grid grid-cols-3 gap-x-2 gap-y-12 text-center w-full mb-10 transition-all duration-700 delay-150 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
            </div>
          </div>
        </div>

        {/* BIG BACKGROUND TEXT */}
        <div className="overflow-hidden w-full mt-4">
          <h1 className={`w-full text-center leading-none text-[20vw] md:text-[15vw] font-extrabold text-white/100 tracking-tight pointer-events-none select-none transition-all duration-1000 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
            VORCAS
          </h1>
        </div>

        {/* COPYRIGHT */}
        <p className={`text-center text-black text-xs sm:text-sm lg:text-lg mt-4 transition-all duration-700 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          &copy; {new Date().getFullYear()} Vorcas TechLab &mdash; All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
