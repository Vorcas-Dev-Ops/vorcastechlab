import React, { useEffect, useRef } from 'react';

const About = ({ aboutSectionRef, aboutBoxRef, aboutBgTextRef }) => {
  return (
    <section className="relative bg-bg h-[400vh] z-[10] scroll-mt-24" id="about-section" ref={aboutSectionRef}>

      <div className="sticky top-0 h-screen flex items-center justify-center z-0 overflow-hidden px-4 md:px-0">
        <h2
          className="text-[clamp(3.5rem,17vw,18rem)] font-black whitespace-nowrap text-[#151518] m-0 leading-none uppercase transition-all duration-300 ease-out text-center w-full"
          ref={aboutBgTextRef}
        >
          ABOUT<span className="text-accent opacity-15">*</span>US
        </h2>
      </div>

      <div className="sticky top-0 h-screen z-10 flex justify-center items-center pointer-events-none perspective-[1200px] max-w-[1200px] mx-auto px-6 md:px-8 w-full">
        <div className="relative w-full flex justify-center items-center pointer-events-none">
          <div
            className="relative preserve-3d linear pointer-events-auto"
            id="aboutBox"
            ref={aboutBoxRef}
            style={{ width: 'var(--cube-w)', height: 'var(--cube-h)' }}
          >
            {[
              { num: '1', title: 'Built on Innovation, Driven by Excellence', desc: 'With years of hands-on experience in web, app, and custom software development, we deliver solutions that are smart, scalable, and built to last.', face: 'front', transform: 'rotateX(0deg) translateZ(var(--cube-z))' },
              { num: '3', title: 'A Team That Thinks Beyond the Code', desc: 'Our experts dont just write code — they understand your business, your users, and your goals. We collaborate closely with every client.', face: 'back', transform: 'rotateX(180deg) translateZ(var(--cube-z))' },
              { num: '4', title: 'Who We Are — Your Digital Growth Partner', desc: 'We are a passionate IT services company dedicated to turning bold ideas into powerful digital solutions. From startups to enterprises.', face: 'bottom', transform: 'rotateX(90deg) translateZ(var(--cube-z))' },
              { num: '2', title: 'Trusted by Businesses, Proven by Results', desc: 'From custom CRMs to enterprise HRM platforms and dynamic web applications, our portfolio speaks for itself.', face: 'top', transform: 'rotateX(270deg) translateZ(var(--cube-z))' },
            ].map((face) => (
              <div
                key={face.num}
                className={`face ${face.face} absolute flex items-center justify-start bg-[#020202] border border-white/5 backface-hidden overflow-hidden`}
                style={{ transform: face.transform }}
              >
                <div className="relative z-[2] max-w-[85%] md:max-w-[75%]">
                  <h4 className="text-accent text-[0.7rem] md:text-[0.8rem] tracking-[1.8px] mb-3 md:mb-5 font-bold uppercase">{face.title}</h4>
                  <p className="text-white text-[0.85rem] md:text-[1rem] font-medium leading-[1.6] opacity-90">{face.desc}</p>
                </div>
                <div className="absolute right-[2%] bottom-[20%] md:bottom-[30%] text-[6rem] md:text-[10rem] font-black text-[#111114] leading-[0.8] z-[1]">{face.num}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
