import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Fish, Clock, Award, Phone, Mail, ArrowRight, Store, Truck, Home, Droplets, CheckCircle2, Star, Scissors, Sparkles } from 'lucide-react';

export default function AboutView() {
  const [expandedEmployee, setExpandedEmployee] = useState<number | null>(null);

  const stars = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 12 + 8, // 8px to 20px
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
    }));
  }, []);

  const processSteps = [
    { icon: <Store size={24} />, title: "The Shop", desc: "Fresh catch arrives daily", color: "from-blue-400 to-blue-600" },
    { icon: <Droplets size={24} />, title: "Processing", desc: "Cleaned with RO water", color: "from-cyan-400 to-cyan-600" },
    { icon: <Award size={24} />, title: "Packing", desc: "Vacuum sealed for freshness", color: "from-teal-400 to-teal-600" },
    { icon: <Truck size={24} />, title: "Delivery", desc: "Lightning fast dispatch", color: "from-emerald-400 to-emerald-600" },
    { icon: <Home size={24} />, title: "Your Kitchen", desc: "Ready to cook", color: "from-green-400 to-green-600" }
  ];

  const employees = [
    {
      name: "Rahul Sharma",
      designation: "Master Cutter",
      email: "rahul@henafish.com",
      phone: "+91 98765 00001",
      img: "https://picsum.photos/seed/rahul/200/200"
    },
    {
      name: "Amit Kumar",
      designation: "Quality Inspector",
      email: "amit@henafish.com",
      phone: "+91 98765 00002",
      img: "https://picsum.photos/seed/amit/200/200"
    },
    {
      name: "Priya Singh",
      designation: "Store Manager",
      email: "priya@henafish.com",
      phone: "+91 98765 00003",
      img: "https://picsum.photos/seed/priya/200/200"
    },
    {
      name: "Vikram Das",
      designation: "Delivery Head",
      email: "vikram@henafish.com",
      phone: "+91 98765 00004",
      img: "https://picsum.photos/seed/vikram/200/200"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto pb-24 md:pb-12 pt-4 md:pt-8 px-4">
      {/* Our Story Section - New Beginning */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100"
      >
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl order-2 md:order-1">
          <img 
            src="src/images/image.jpg" 
            alt="Hena Fish Suppliers Shop" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
              <span className="text-white font-bold text-sm">Est. 2012</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 order-1 md:order-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            <Store size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Our Legacy</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
            12+ Years of <span className="text-blue-600">Trust & Tradition</span>
          </h2>
          
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p className="font-medium text-slate-800">
              At Hena Fish Suppliers, we proudly carry forward over 12+ years of trust and tradition from the heart of Kolkata. Rooted in Gorabazar, Dumdum Cantonment, our journey is inspired by Bengal’s deep love for fresh, quality fish.
            </p>
            <p className="text-sm">
              From Rui, Katla to seasonal favorites, we offer a wide variety—carefully selected and handled by our experienced cutting masters and pre-processing experts. Every fish is cleaned and prepared with care, maintaining the authentic taste and hygiene that Bengali kitchens value the most.
            </p>
            <p className="text-sm">
              Be it daily meals, special occasions, or bulk orders, we deliver with commitment across Kolkata and West Bengal. Our relationship with customers goes beyond business—we believe in <span className="text-blue-600 font-bold italic">“aatmiota”</span> (warmth) and respect, treating every customer like family.
            </p>
            <p className="text-sm bg-blue-50/50 p-4 rounded-2xl border-l-4 border-blue-500 italic text-slate-700">
              You are always welcome to visit us at Gorabazar, Dumdum, and experience the freshness, trust, and true Bengali essence that define Hena Fish Suppliers.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {[
          { 
            icon: <Scissors size={24} />, 
            title: "Cutting Masters", 
            desc: "Expertly handled by our experienced cutting masters, ensuring perfect cuts for every variety of Bengali fish.",
            titleColor: "text-indigo-700",
            iconBg: "bg-indigo-50",
            iconColor: "text-indigo-600",
            borderAnim: ['#312e81', '#a5b4fc', '#312e81'] // Deep Indigo to Light Indigo
          },
          { 
            icon: <Sparkles size={24} />, 
            title: "Pre-processing Experts", 
            desc: "Our experts clean and prepare every fish with RO water, maintaining authentic taste and hygiene Bengali kitchens value.",
            titleColor: "text-cyan-700",
            iconBg: "bg-cyan-50",
            iconColor: "text-cyan-600",
            borderAnim: ['#083344', '#67e8f9', '#083344'] // Deep Cyan to Light Cyan
          },
          { 
            icon: <Truck size={24} />, 
            title: "Lightning Fast", 
            desc: "Delivering across Kolkata. Fast doorstep delivery for ready-to-cook items in Dumdum Cantonment (700028 & 700065).",
            titleColor: "text-rose-600",
            iconBg: "bg-rose-50",
            iconColor: "text-rose-600",
            borderAnim: ['#9f1239', '#fda4af', '#9f1239'] // Deep Rose to Light Rose
          }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20, borderColor: feature.borderAnim[0] }}
            animate={{ opacity: 1, y: 0, borderColor: feature.borderAnim }}
            transition={{ 
              opacity: { delay: 0.2 + idx * 0.1 },
              y: { delay: 0.2 + idx * 0.1 },
              borderColor: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="bg-white p-6 rounded-[2.5rem] shadow-sm border-[3px] text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className={`w-16 h-16 ${feature.iconBg} ${feature.iconColor} rounded-2xl flex items-center justify-center mb-5 shadow-inner`}>
              {feature.icon}
            </div>
            <h3 className={`font-black mb-3 text-xl tracking-tight ${feature.titleColor}`}>{feature.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium px-2">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Horizontal Process Chain */}
      <div className="mb-16 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 text-center mb-10">From Shop to Your Kitchen</h2>
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-0 bottom-0 left-[31px] md:left-0 md:top-10 md:bottom-auto w-1 md:w-full md:h-1 bg-slate-100 md:-translate-y-1/2 z-0 rounded-full" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-8 md:gap-4 relative z-10">
            {processSteps.map((step, idx) => (
              <div key={idx} className="flex flex-row md:flex-col items-center md:items-center group w-full md:w-1/5 gap-6 md:gap-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                  className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl md:rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 relative z-10`}
                >
                  {step.icon}
                </motion.div>
                <div className="flex-1 md:text-center">
                  <h3 className="font-bold text-slate-800 text-lg md:text-base">{step.title}</h3>
                  <p className="text-sm md:text-xs text-slate-500 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 text-center mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {employees.map((emp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group cursor-pointer md:cursor-default"
              onClick={() => setExpandedEmployee(expandedEmployee === idx ? null : idx)}
            >
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img src={emp.img} alt={emp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <h3 className="font-bold text-white text-xl drop-shadow-md">{emp.name}</h3>
                  {/* Designation - Always visible on desktop, visible on mobile if expanded */}
                  <div className={`text-sm font-medium text-blue-300 transition-all duration-300 ${expandedEmployee === idx ? 'block' : 'hidden md:block'}`}>
                    {emp.designation}
                  </div>
                </div>
              </div>
              <div className="p-4 relative z-20 bg-white">
                {/* Hint for mobile */}
                <div className={`text-xs font-medium text-slate-400 md:hidden flex items-center justify-between ${expandedEmployee === idx ? 'hidden' : 'block'}`}>
                  <span>Tap to view contact details</span>
                  <ArrowRight size={14} />
                </div>

                <div 
                  className={`grid transition-all duration-300 ease-in-out md:grid-rows-[1fr] ${expandedEmployee === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 md:opacity-100'}`}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-3 pt-3 md:pt-0">
                      <a href={`mailto:${emp.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                          <Mail size={14} />
                        </div>
                        <span className="truncate">{emp.email}</span>
                      </a>
                      <a href={`tel:${emp.phone}`} className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30" onClick={(e) => e.stopPropagation()}>
                        <Phone size={16} />
                        Call Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Helpline Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-[2rem] overflow-hidden p-8 md:p-12 text-center shadow-xl"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-r from-red-800 via-rose-700 to-orange-600 opacity-95" 
          style={{ backgroundSize: '200% 200%', animation: 'gradient-xy 5s ease infinite' }}
        />
        
        {/* Blinking Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute text-yellow-200/80"
              style={{ left: star.left, top: star.top }}
              animate={{
                opacity: [0.1, 1, 0.1],
                scale: [0.8, 1.3, 0.8],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: "easeInOut",
              }}
            >
              <Star size={star.size} fill="currentColor" />
            </motion.div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md mb-4 shadow-inner border border-white/30">
            <Phone size={28} className="text-white animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight drop-shadow-md">Need Assistance?</h2>
          <p className="text-white/90 text-sm md:text-base mb-6 max-w-lg mx-auto font-medium drop-shadow">
            Our helpline is always open for your queries, custom orders, or any assistance you need. We're just a call away!
          </p>
          <div className="relative inline-block mt-2">
            <div className="absolute -inset-2 bg-white/30 rounded-full blur-md animate-pulse"></div>
            <a 
              href="tel:+919876543210"
              className="relative inline-flex items-center gap-3 bg-white text-red-700 hover:bg-red-50 px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-lg md:text-xl transition-all hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg border-2 border-white/50"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                <div className="bg-red-600 text-white p-2 md:p-2.5 rounded-full relative z-10 shadow-md">
                  <Phone size={20} className="fill-current" />
                </div>
              </div>
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
