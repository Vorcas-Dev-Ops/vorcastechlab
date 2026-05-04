import React from 'react';

const Team = ({ teamGridRef, teamBgTextRef }) => {
  const team = [
    { name: 'Alex Johnson', role: 'Chief Executive Officer (CEO)', img: 'https://images.unsplash.com/photo-15062771886164-e25aa3f4ef7f?q=80&w=600&auto=format&fit=crop' },
    { name: 'Megan Smith', role: 'Creative Director', img: 'https://images.unsplash.com/photo-1531123897727-8f1291e1bf98c?q=80&w=600&auto=format&fit=crop' },
    { name: 'Michael Davis', role: 'Lead Developer', img: 'https://images.unsplash.com/photo-1500648767791-00dc1c994a43e?q=80&w=600&auto=format&fit=crop' },
    { name: 'Sophia Martinez', role: 'Head of UX/UI Design', img: 'https://images.unsplash.com/photo-14947901108377-be9c29b29330?q=80&w=600&auto=format&fit=crop' },
    { name: 'Daniel Kim', role: 'Digital Marketing Manager', img: 'https://images.unsplash.com/photo-15071003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop' },
    { name: 'Emily Brown', role: 'Senior Project Manager', img: 'https://images.unsplash.com/photo-15345287411775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
  ];

  const awards = [
    '🏆 CSS Nectar - Site of the Day',
    '🏅 Web Guru Awards',
    '📱 Mobile Excellence Awards',
    '🥁 The Drum Awards',
    '🌍 International Design Awards'
  ];

  return (
    <section className="relative bg-bg py-12 md:py-20" id="team">
      <div className="sticky top-0 h-screen flex items-center justify-center z-0 overflow-hidden">
        <h2
          className="text-[clamp(4rem,12vw,11rem)] font-black whitespace-nowrap text-white transition-opacity duration-700 m-0 leading-none uppercase"
          id="teamBgText"
          ref={teamBgTextRef}
        >
          MEET<span className="text-accent">*</span>THE<span className="text-accent">*</span>TEAM
        </h2>
      </div>
      <div className="relative z-10 pb-20 max-w-[1200px] mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20" id="teamGrid" ref={teamGridRef}>
          {team.map((member, idx) => (
            <div key={idx} className="team-member relative h-[480px] bg-surface overflow-hidden reveal-up">
              <img src={member.img} alt={member.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[0.8s] hover:scale-110" />
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/95 via-black/50 to-transparent text-center z-[2]">
                <h3 className="m-0 mb-1 text-[1.25rem] font-bold text-white">{member.name}</h3>
                <p className="m-0 text-[0.85rem] text-white/60">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-hidden bg-glass-bg border border-glass-border rounded-[50px] py-6 whitespace-nowrap reveal-opacity delay-400">
          <div className="inline-block animate-ticker">
            {awards.map((award, idx) => (
              <span key={idx} className="inline-block mx-8 font-medium text-white/70">{award}</span>
            ))}
            {awards.map((award, idx) => (
              <span key={`dup-${idx}`} className="inline-block mx-8 font-medium text-white/70">{award}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
