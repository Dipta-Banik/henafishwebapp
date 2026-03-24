import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export default function HeroBox() {
  const [current, setCurrent] = useState(0);
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  // Get specific combos for the hero slider
  const slides = [
    products.find(p => p.id === 'CP5') ? {
      ...products.find(p => p.id === 'CP5'), // Katla Combo
      badge: "Today Offer",
      badgeColor: "bg-red-500/90 border-red-400/50 shadow-[0_0_20px_rgba(239,68,68,0.6)]",
      gradient: "from-blue-900/95 via-blue-800/70",
      buttonColor: "text-blue-900 hover:bg-blue-50"
    } : null,
    products.find(p => p.id === 'P3') ? {
      ...products.find(p => p.id === 'P3'), // Lobster
      title: "Jumbo Tiger Prawns",
      subtitle: "Fresh from Bay of Bengal (গলদা চিংড়ি)",
      oldPrice: 1600,
      badge: "Premium Catch",
      badgeColor: "bg-amber-500/90 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.6)]",
      gradient: "from-slate-900/95 via-slate-800/70",
      buttonColor: "text-slate-900 hover:bg-slate-50"
    } : null,
    products.find(p => p.id === 'P1') ? {
      ...products.find(p => p.id === 'P1'), // Hilsa
      title: "Grand Hilsa Festival",
      subtitle: "Authentic Padma Ilish (পদ্মার ইলিশ) - 1.2kg+",
      oldPrice: 1400,
      badge: "Weekend Special",
      badgeColor: "bg-emerald-500/90 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.6)]",
      gradient: "from-teal-900/95 via-teal-800/70",
      buttonColor: "text-teal-900 hover:bg-teal-50"
    } : null
  ].filter(s => s && s.id) as any[];

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) return <div className="animate-pulse bg-slate-200 w-full h-full min-h-[300px] rounded-3xl"></div>;
  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-[200px] sm:h-[240px] md:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden group shadow-lg md:shadow-xl shadow-blue-900/10 border border-white/40 bg-slate-900">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image with Ken Burns Effect */}
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: 6, ease: "linear" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].img})` }}
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slides[current].gradient} to-transparent`} />
          
          {/* Animated Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/10 to-transparent mix-blend-overlay" />

          {/* Content */}
          <div className="absolute inset-0 p-4 md:p-10 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              className="max-w-lg w-full"
            >
              <div className={`inline-block px-2 py-0.5 md:px-3 md:py-1 mb-2 md:mb-5 rounded-full backdrop-blur-md border text-white text-[8px] md:text-xs font-bold uppercase tracking-widest animate-pulse ${slides[current].badgeColor}`}>
                {slides[current].badge}
              </div>
              
              <h2 className="text-xl sm:text-2xl md:text-5xl font-extrabold text-white mb-1 md:mb-3 leading-tight drop-shadow-lg">
                {slides[current].title || slides[current].nameEn}
              </h2>
              <p className="text-white/90 text-xs sm:text-sm md:text-xl mb-3 md:mb-6 font-medium drop-shadow-md">
                {slides[current].subtitle || slides[current].nameBn}
              </p>
              
              <div className="flex items-end gap-2 md:gap-4 mb-3 md:mb-8">
                <span className="text-2xl sm:text-3xl md:text-5xl font-black text-white drop-shadow-xl">₹{slides[current].price}</span>
                {slides[current].oldPrice && (
                  <span className="text-sm md:text-xl text-white/60 line-through font-bold mb-0.5 md:mb-1">₹{slides[current].oldPrice}</span>
                )}
              </div>
              
              <button 
                onClick={() => addToCart(slides[current], 1)}
                className={`w-fit bg-white px-5 py-2 md:px-8 md:py-3.5 rounded-lg md:rounded-2xl font-bold text-xs md:text-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1 active:translate-y-0 ${slides[current].buttonColor}`}
              >
                Add to Cart
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Indicators */}
      <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
              current === idx ? 'w-6 md:w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'w-1.5 md:w-2 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      
      {/* Glassmorphism Badge */}
      <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl hidden md:block shadow-lg z-20">
        <div className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Fresh from</div>
        <div className="text-white font-bold text-lg">Gorabazar, Dumdum</div>
      </div>
    </div>
  );
}
