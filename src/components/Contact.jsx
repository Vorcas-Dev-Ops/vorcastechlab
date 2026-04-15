import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin, User, LayoutGrid, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const services = [
    { id: 'web-development', label: 'Web Development' },
    { id: 'mobile-apps', label: 'Mobile Application' },
    { id: 'e-commerce', label: 'E-Commerce Store' },
    { id: 'ui-ux', label: 'UI/UX Brand Design' },
    { id: 'consultation', label: 'Technical Consultation' }
  ];


  const [status, setStatus] = useState({ loading: false, success: false, message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.service) {
      alert("Please select a service type");
      return;
    }

    setStatus({ loading: true, success: false, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service: services.find(s => s.id === formData.service)?.label || formData.service
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ loading: false, success: true, message: data.message });
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      } else {
        setStatus({ loading: false, success: false, message: data.message || 'Something went wrong.' });
      }
    } catch (error) {
      setStatus({ loading: false, success: false, message: 'Failed to connect to server. Please try again later.' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#050505] relative overflow-hidden scroll-mt-24" id="contact">

      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">

          {/* Left Content Column (More Compact) */}
          <div className="md:col-span-5 lg:col-span-4 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] uppercase font-black tracking-[0.2em] text-orange-500">
                <Sparkles size={10} />
                Connect
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tighter">
                Scale Your <span className="text-orange-500">Vision</span>
              </h2>
              <p className="text-white/40 text-[13px] leading-relaxed max-w-sm">
                Have an idea? Let's turn it into a digital reality. Reach out and start building.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: <Mail size={16} />, label: "Email Us", val: "support@vorcastechlab.com", link: "mailto:support@vorcastechlab.com" },
                { icon: <Phone size={16} />, label: "Call Us", val: "+91 8123139994", link: "tel:+91 8123139994" },
                { icon: <MapPin size={16} />, label: "Visit Us", val: "2nd Floor, Plot No-29, Thambu Chetty Palya Main Rd, Akshaya Nagar 1st Block, Akshaya Nagar, Ramamurthy Nagar, Bengaluru, Karnataka 560016", link: "#" }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  className="group flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-orange-500/20 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-600/10 flex items-center justify-center text-orange-500">
                    {item.icon}
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-white/20 tracking-widest leading-none mb-1">{item.label}</span>
                    <span className="block text-[13px] font-medium text-white/80 group-hover:text-white transition-colors">{item.val}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Form Column (Wider) */}
          <div className="md:col-span-7 lg:col-span-8">
            <div className="relative group">
              {/* Card Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-[1.5rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-700"></div>

              <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] p-6 md:p-8 shadow-2xl overflow-hidden">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

                {status.success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 flex flex-col items-center justify-center py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 mb-2">
                      <Sparkles size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                    <p className="text-white/60 max-w-xs">{status.message}</p>
                    <button
                      onClick={() => setStatus({ ...status, success: false })}
                      className="mt-6 text-orange-500 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black text-white/30 tracking-[0.1em] ml-1">Your Name</label>
                      <div className="relative group/input">
                        <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-orange-500 transition-colors" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Full Name"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black text-white/30 tracking-[0.1em] ml-1">Email Address</label>
                      <div className="relative group/input">
                        <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-orange-500 transition-colors" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="hello@world.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black text-white/30 tracking-[0.1em] ml-1">Phone Number</label>
                      <div className="relative group/input">
                        <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-orange-500 transition-colors" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="+1 (000) 000-0000"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 relative">
                      <label className="text-[9px] uppercase font-black text-white/30 tracking-[0.1em] ml-1">Service Type</label>
                      <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative group/input cursor-pointer"
                      >
                        <LayoutGrid size={14} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isOpen ? 'text-orange-500' : 'text-white/20 group-hover/input:text-white/40'}`} />
                        <div className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-10 text-sm text-white/80 focus:outline-none transition-all flex items-center justify-between">
                          <span className={formData.service ? "text-white" : "text-white/20"}>
                            {services.find(s => s.id === formData.service)?.label || "Select Service Type"}
                          </span>
                          <ArrowRight size={12} className={`text-white/20 transition-transform duration-300 ${isOpen ? 'rotate-90 text-orange-500' : 'rotate-0'}`} />
                        </div>
                      </div>

                      {/* Custom Dropdown Menu with hidden scrollbar */}
                      {isOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-[#0d0d0d] border border-white/10 rounded-xl py-2 z-50 shadow-2xl max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                          <div className="flex flex-col">

                            {services.map((s) => (
                              <div
                                key={s.id}
                                onClick={() => {
                                  setFormData({ ...formData, service: s.id });
                                  setIsOpen(false);
                                }}
                                className={`px-4 py-2.5 text-[13px] cursor-pointer transition-all flex items-center justify-between ${formData.service === s.id ? 'bg-orange-500/10 text-orange-500' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                              >
                                {s.label}
                                {formData.service === s.id && <Sparkles size={10} />}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>




                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[9px] uppercase font-black text-white/30 tracking-[0.1em] ml-1">Project Details</label>
                      <div className="relative group/input">
                        <MessageSquare size={14} className="absolute left-4 top-4 text-white/20 group-focus-within/input:text-orange-500 transition-colors" />
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="2"
                          placeholder="Tell us about your venture..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all resize-none"
                        ></textarea>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={status.loading}
                      className="md:col-span-2 w-full py-4 bg-white text-black rounded-[0.8rem] font-bold uppercase tracking-widest text-[11px] hover:bg-orange-500 hover:text-white transition-all transform active:scale-95 flex items-center justify-center gap-3 group shadow-2xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status.loading ? "Sending..." : "Send"}
                      <Send size={15} className={`group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${status.loading ? 'animate-pulse' : ''}`} />
                    </button>

                    {status.message && !status.success && (
                      <p className="md:col-span-2 text-center text-red-500 text-[10px] font-bold uppercase tracking-wider">{status.message}</p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>

  );
};

export default Contact;

