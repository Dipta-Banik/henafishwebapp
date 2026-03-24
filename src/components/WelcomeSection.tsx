import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { MapPin, Clock, Heart, Sparkles, Star, ShieldCheck, Users, ArrowRight, ShoppingBag } from 'lucide-react';

interface WelcomeSectionProps {
  onViewCategories?: () => void;
}

export default function WelcomeSection({ onViewCategories }: WelcomeSectionProps) {
  const [index, setIndex] = useState(0);
  
  const subtexts = [
    {
      title: "Fresh Fish, Pure Bengali Taste",
      desc: "Straight from the heart of Kolkata, we bring you handpicked fresh fish, cleaned and cut with care—just like home.",
      color: "text-blue-600",
      bg: "bg-blue-50/50",
      border: "border-blue-100",
      accent: "bg-blue-600"
    },
    {
      title: "Soul of Bengali Kitchens",
      desc: "Carefully selected fish, skilled cutting, and a promise of freshness in every order from Kolkata.",
      color: "text-emerald-600",
      bg: "bg-emerald-50/50",
      border: "border-emerald-100",
      accent: "bg-emerald-600"
    },
    {
      title: "Trust, Care, and Warmth",
      desc: "More than just a supplier, we deliver warmth in every order. Visit us at Gorabazar, Dumdum—where every customer is family.",
      color: "text-orange-600",
      bg: "bg-orange-50/50",
      border: "border-orange-100",
      accent: "bg-orange-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % subtexts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [subtexts.length]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 mb-8"
    >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Fish Watermark */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
          animate={{ opacity: 0.2, scale: 1, rotate: -15 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute -right-12 -bottom-12 w-[500px] h-[500px] select-none pointer-events-none grayscale contrast-125 drop-shadow-2xl"
        >
          <img 
            src="https://www.shutterstock.com/image-vector/black-white-koi-fish-illustration-600nw-2715664665.jpg" 
            alt="Fish Watermark" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
            y: [0, -40, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/30 via-cyan-50/20 to-transparent rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-100/30 via-rose-50/20 to-transparent rounded-full blur-[120px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.15]" />
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
            Welcome to <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 drop-shadow-sm">
              Hena Chicken & Fish!
            </span>
          </h1>
          
          <div className="relative mb-10 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`p-6 md:p-8 rounded-[2rem] border-2 shadow-xl shadow-slate-200/50 ${subtexts[index].bg} ${subtexts[index].border} backdrop-blur-sm relative overflow-hidden`}
              >
                {/* Decorative Icon Background */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12">
                  <Sparkles size={120} />
                </div>

                <h3 className={`text-xl md:text-2xl font-black mb-3 flex items-center justify-center md:justify-start gap-3 ${subtexts[index].color}`}>
                  <Sparkles size={24} className="shrink-0" />
                  {subtexts[index].title}
                </h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                  {subtexts[index].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Indicators */}
            <div className="flex justify-center md:justify-start gap-2 mt-4 px-2">
              {subtexts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === i ? `w-8 ${subtexts[i].accent}` : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewCategories}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 group"
            >
              <ShoppingBag size={22} />
              Shop Now
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* Trust Bar */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Users size={16} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800">10k+ Families</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Served with Trust</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800">FSSAI Certified</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Lic. No: 22824035000123</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side Panel with Bengali Glow Effect */}
        <div className="hidden lg:flex flex-col gap-6 w-1/3">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, x: -5 }}
            className="relative group"
          >
            {/* Bengali Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-rose-500 to-amber-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            
            <div className="relative bg-white/90 backdrop-blur-md p-7 rounded-[2.5rem] border border-orange-100 shadow-xl shadow-orange-900/5 overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-100 rounded-full blur-2xl opacity-50" />
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-200">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-[10px] text-orange-600 font-black uppercase tracking-[0.2em] mb-2">Service Area</div>
                  <div className="text-lg font-black text-slate-800 leading-tight mb-1">
                    Across Local Areas of <br />
                    <span className="text-orange-600">Dumdum</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[11px] font-black rounded-full border border-orange-200">700028</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[11px] font-black rounded-full border border-orange-200">700065</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, x: -5 }}
            className="relative group"
          >
            {/* Bengali Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            
            <div className="relative bg-white/90 backdrop-blur-md p-7 rounded-[2.5rem] border border-emerald-100 shadow-xl shadow-emerald-900/5 overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-100 rounded-full blur-2xl opacity-50" />
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mb-2">Delivery</div>
                  <div className="text-lg font-black text-slate-800 leading-tight mb-1">
                    On your <br />
                    <span className="text-emerald-600">preferred time</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-black rounded-full border border-emerald-200">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Scheduled
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-black rounded-full border border-emerald-200">
                      <ShieldCheck size={12} />
                      Reliable
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
