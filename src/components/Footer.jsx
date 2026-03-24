import React from "react";
import { Facebook, Instagram, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="bg-orange-600">
      <footer className="relative text-white pt-12 max-[400px]:pt-8 sm:pt-16 md:pt-12 lg:pt-20 xl:pt-18 2xl:pt-32 pb-6 px-6 md:px-12 lg:px-24 overflow-hidden flex flex-col">

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center w-full">

            {/* LOGO + SOCIAL */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-[400px]:gap-2 sm:gap-6 md:gap-4 lg:gap-10 xl:gap-12 2xl:gap-14 mb-2 sm:mb-2 md:mb-2 lg:mb-4 xl:mb-4 2xl:mb-4">

              <h2 className="text-xl max-[400px]:text-lg sm:text-2xl md:text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight">
                Vorcas Tech<span className="text-black">Lab</span>
              </h2>

              <div className="flex gap-2 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-7 2xl:gap-8 mt-2 sm:mt-0">
                <a
                  href="https://twitter.com"
                  className="bg-white/10 hover:bg-white/20 p-2 sm:p-2.5 md:p-2.5 lg:p-3.5 xl:p-4 2xl:p-5 rounded-lg transition"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9" />
                </a>

                <a
                  href="https://facebook.com"
                  className="bg-white/10 hover:bg-white/20 p-2 sm:p-2.5 md:p-3 lg:p-3.5 xl:p-4 2xl:p-5 rounded-lg transition"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9" />
                </a>

                <a
                  href="https://instagram.com"
                  className="bg-white/10 hover:bg-white/20 p-2 sm:p-2.5 md:p-3 lg:p-3.5 xl:p-4 2xl:p-5 rounded-lg transition"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9" />
                </a>
              </div>
            </div>

            {/* GRID LINKS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-[400px]:gap-5 sm:gap-8 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 text-center max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl w-full mb-1 sm:mb-2 md:mb-1 lg:mb-2 xl:mb-1 2xl:mb-2">

              {/* COMPANY */}
              <div>
                <h3 className="text-xl sm:text-xl md:text-xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold mb-3 sm:mb-4 md:mb-2 lg:mb-6 xl:mb-4 2xl:mb-8 text-black">
                  Company
                </h3>

                <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4 xl:space-y-5 2xl:space-y-6 text-sm sm:text-base md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl">
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>

              {/* SERVICES */}
              <div>
                <h3 className="text-xl sm:text-xl md:text-xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold mb-3 sm:mb-4 md:mb-2 lg:mb-6 xl:mb-4 2xl:mb-8 text-black">
                  Services
                </h3>

                <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4 xl:space-y-5 2xl:space-y-6 text-sm sm:text-base md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl">
                  <li>Web Development</li>
                  <li>Mobile Apps</li>
                  <li>E-Commerce</li>
                  <li>UI/UX Design</li>
                </ul>
              </div>

              {/* RESOURCES */}
              <div>
                <h3 className="text-xl sm:text-xl md:text-xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold mb-3 sm:mb-4 md:mb-2 lg:mb-6 xl:mb-4 2xl:mb-8 text-black">
                  Resources
                </h3>

                <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4 xl:space-y-5 2xl:space-y-6 text-sm sm:text-base md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl">
                  <li><Link to="/projects">Projects</Link></li>
                  <li>Testimonials</li>
                  <li>FAQs</li>
                  <li><Link to="/contact">Support</Link></li>
                </ul>
              </div>

            </div>
          </div>

          {/* BIG BACKGROUND TEXT */}
          <h1
            className="
            w-full text-center
            leading-none
            text-[3rem]
            max-[350px]:text-[2.2rem]
            max-[400px]:text-[2.8rem]
            sm:text-[6rem]
            md:text-[8rem]
            lg:text-[12rem]
            xl:text-[14rem]
            2xl:text-[18rem]
            font-extrabold
            text-white/100
            tracking-tight
            pointer-events-none
            select-none
            mt-0 sm:mt-1 md:-mt-6 lg:mt-1 xl:mt-1 2xl:mt-1
          "
          >
            VORCAS
          </h1>

          {/* COPYRIGHT */}
          <div className="text-center text-black text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl mt-1 sm:mt-1.5 md:-mt-1 lg:mt-2 xl:mt-2 2xl:mt-3">
            © {new Date().getFullYear()} Vorcas TechLab — All Rights Reserved.
          </div>

      </footer>
    </div>
  );
}