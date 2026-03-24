import React from 'react';

const Testimonials = () => {
  const reviews = [
    { text: "The team at DesignCube exceeded our expectations with their creative branding and graphic design services. They captured the essence of our brand perfectly.", author: "Emily Davis", role: "Founder, Artisan Crafts" },
    { text: "DesignCube’s UX/UI design expertise transformed our app into a user-friendly and engaging platform. Their collaborative approach was evident.", author: "Michael Brown", role: "Product Manager, Innovatech" },
    { text: "Working with DesignCube was a game-changer for our brand. Their innovative design solutions helped us create a stunning website representing our values.", author: "Marketing Director", role: "Bright Ideas Inc." },
    { text: "DesignCube's expertise in SEO optimization and digital marketing has dramatically improved our online presence and increased our sales by 25%.", author: "CEO", role: "TechWorld Solutions" },
  ];

  return (
    <section className="py-12 md:py-20 bg-bg" id="testimonials">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <div className="section-badge reveal-up delay-100">05 — Customer Thoughts</div>
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8">
          {reviews.map((t, idx) => (
            <div key={idx} className="testimonial glass-panel flex flex-col justify-between reveal-up">
              <p className="text-[1.1rem] italic mb-8 relative text-white">"{t.text}"</p>
              <div className="author">
                <h4 className="text-accent mb-1 font-bold">{t.author}</h4>
                <p className="text-[0.85rem] text-text-secondary uppercase tracking-[1px]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
