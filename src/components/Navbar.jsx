import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import logo from "../assets/Vorcasw.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation(); // Added to use location.pathname in isActive

  useEffect(() => {

    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);

    // Scroll Spying
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the section is entering the middle detection zone
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        // Use a narrow rootMargin to detect the 'active' section in the middle
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0
      }
    );

    const sections = ["hero-section", "ourservice", "ourservice-desktop", "about-section", "projects", "tech-stack", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);


  /* Scroll to Services — picks mobile or desktop section based on viewport */
  const goToService = () => {
    const isMobile = window.innerWidth < 768;
    const targetId = isMobile ? "ourservice" : "ourservice-desktop";
    if (window.location.pathname === "/") {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
    }
    setMobileOpen(false);
  };

  /* Scroll to About */
  const goToAbout = () => {
    if (window.location.pathname === "/") {
      document.getElementById("about-section")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("about-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
    }
    setMobileOpen(false);
  };



  /* Scroll to Hero */
  const goToHero = () => {
    if (window.location.pathname === "/") {
      document.getElementById("hero-section")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/#hero");
      setTimeout(() => {
        document.getElementById("hero-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
    }
    setMobileOpen(false);
  };

  const goContact = () => {
    if (window.location.pathname === "/") {
      document.getElementById("contact")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
    }
    setMobileOpen(false);
  };


  /* Scroll to Projects */
  const goToProjects = () => {
    if (window.location.pathname === "/") {
      document.getElementById("projects")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/#projects");
      setTimeout(() => {
        document.getElementById("projects")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
    }
    setMobileOpen(false);
  };

  /* Scroll to TechStack */
  const goToTechStack = () => {
    if (window.location.pathname === "/") {
      document.getElementById("tech-stack")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/#tech-stack");
      setTimeout(() => {
        document.getElementById("tech-stack")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
    }
    setMobileOpen(false);
  };
  const navItems = [
    { id: "ourservice", label: "Services", fn: goToService, type: "scroll" },
    { id: "about-section", label: "About", fn: goToAbout, type: "scroll" },
    { id: "projects", label: "Projects", fn: goToProjects, type: "scroll" },
    { id: "tech-stack", label: "Tech Stack", fn: goToTechStack, type: "scroll" },
    { id: "contact", label: "Contact", fn: goContact, type: "scroll" },
    { id: "career", label: "Careers", path: "/career", type: "link" }
  ];



  const isActive = (item) => {
    if (item.type === "scroll") {
      // Services nav item matches either the mobile or desktop section
      if (item.id === "ourservice") {
        return (activeSection === "ourservice" || activeSection === "ourservice-desktop") && location.pathname === "/";
      }
      return activeSection === item.id && location.pathname === "/";
    }
    return location.pathname === item.path;
  };



  return (

    <>
      <nav
        className={`fixed left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "md:top-5 top-0" : "top-0"
          }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-300 w-full ${isScrolled
            ? "md:w-[90%] lg:max-w-[1100px] mx-auto bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0_0_0_/_0.5)] md:rounded-full py-2 md:py-1.5 px-6 md:px-6 lg:px-8"
            : "bg-transparent py-4 px-6 md:px-8 lg:px-12 max-w-[1400px] mx-auto border border-transparent"
            }`}
        >
          <div className={`flex items-center cursor-pointer transition-all duration-300 ${isScrolled ? "gap-2" : "gap-3"}`} onClick={goToHero}>
            <img src={logo} alt="logo" className={`transition-all duration-300 object-contain ${isScrolled ? "w-8 h-10 mt-0" : "w-11 h-13 mt-1"}`} />
            <span className={`font-bold text-white whitespace-nowrap transition-all duration-300 ${isScrolled ? "text-lg md:text-base lg:text-lg" : "text-xl lg:text-xl md:text-lg"}`}>Vorcas Tech<span className="text-orange-500">Lab</span></span>
          </div>

          {/* Desktop Menu */}
          <ul className={`hidden md:flex items-center transition-all duration-300 font-medium text-white ${isScrolled ? "gap-2 lg:gap-4 text-sm lg:text-[0.95rem]" : "gap-4 lg:gap-6 text-base lg:text-lg"}`}>
            {navItems.map((item) => (
              <li
                key={item.id}
                onClick={item.type === "scroll" ? item.fn : () => navigate(item.path)}
                className={`relative px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300 ${isActive(item) ? "bg-white/10 text-orange-500 shadow-[0_0_15px_rgba(249_115_22_/_0.1)] scale-105" : "text-white/60 hover:text-white hover:bg-white/5"}`}
              >
                {item.label}
                {isActive(item) && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full shadow-[0_0_8px_orange] animate-pulse" />
                )}
              </li>
            ))}
          </ul>




          <button
            onClick={goContact}
            className="relative hidden md:inline-block px-5 py-2 text-[14px] font-bold border border-white/20 rounded-full text-white overflow-hidden z-10 transition-all duration-300 ease-in-out
              before:content-[''] before:absolute before:left-1/2 before:top-full before:w-[140%] before:h-[180%] before:bg-orange-500 before:rounded-full before:-translate-x-1/2 before:scale-x-[1.25] before:scale-y-100 before:z-[-1]
              before:transition-all before:duration-500 before:delay-100 before:ease-[cubic-bezier(0.55,_0,_0.1,_1)]
              
              after:content-[''] after:absolute after:left-[55%] after:top-[180%] after:w-[160%] after:h-[190%] after:bg-orange-600 after:rounded-full after:-translate-x-1/2 after:scale-x-[1.45] after:scale-y-100 after:z-[-1]
              after:transition-all after:duration-500 after:delay-100 after:ease-[cubic-bezier(0.55,_0,_0.1,_1)]
              
              hover:text-white hover:border-orange-500
              hover:before:top-[-35%] hover:before:scale-x-[0.8] hover:before:scale-y-[1.3]
              hover:after:top-[-45%] hover:after:scale-x-[0.8] hover:after:scale-y-[1.3]
            "
          >
            Let's Connect
          </button>

          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-black/60 backdrop-blur-md z-40 text-white pt-24 px-6 transition-all duration-300 ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
      >
        <ul className="flex flex-col gap-6 text-2xl font-bold">
          {navItems.map((item) => (
            <li
              key={item.id}
              className={`border-b pb-4 transition-colors ${isActive(item) ? "text-orange-500" : "text-white"}`}
              onClick={() => {
                item.type === "scroll" ? item.fn() : navigate(item.path);
                setMobileOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>



        <button
          onClick={goContact}
          className="mt-10 w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-full text-xl"
        >
          Let’s Connect
        </button>
      </div>
    </>
  );
}
