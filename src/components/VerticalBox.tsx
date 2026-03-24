import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export default function VerticalBox() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  // Get premium items from products data
  const premiumItems = [
    products.find(p => p.id === 'P1') ? {
      ...products.find(p => p.id === 'P1'), // Hilsa
      tag: "Premium",
      desc: "Padma Catch",
      tagColor: "from-amber-200 to-yellow-400 text-yellow-900",
      shadow: "shadow-[0_0_20px_rgba(251,191,36,0.6)]"
    } : null,
    products.find(p => p.id === 'P2') ? {
      ...products.find(p => p.id === 'P2'), // Pomfret
      tag: "Export Quality",
      desc: "Deep Sea",
      tagColor: "from-slate-200 to-slate-400 text-slate-900",
      shadow: "shadow-[0_0_20px_rgba(148,163,184,0.6)]"
    } : null,
    products.find(p => p.id === 'P3') ? {
      ...products.find(p => p.id === 'P3'), // Lobster
      tag: "Live Catch",
      desc: "Giant River",
      tagColor: "from-rose-300 to-red-500 text-white",
      shadow: "shadow-[0_0_20px_rgba(244,63,94,0.6)]"
    } : null
  ].filter(p => p && p.id) as any[];

  useEffect(() => {
    if (premiumItems.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % premiumItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [premiumItems.length]);

  if (loading) return <div className="animate-pulse bg-slate-200 h-full min-h-[220px] md:min-h-[400px] rounded-3xl"></div>;
  if (premiumItems.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative h-full min-h-[220px] md:min-h-[400px] rounded-2xl md:rounded-3xl overflow-hidden group shadow-lg md:shadow-xl shadow-slate-300/50 bg-slate-900"
    >
      {/* Moving Shimmer Effect */}
      <motion.div 
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 opacity-40 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.5) 0%, transparent 50%)',
          backgroundSize: '200% 200%'
        }}
      />

      {/* Background Images - Vertical Slide */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.7, ease: "anticipate" }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-luminosity"
            style={{ backgroundImage: `url(${premiumItems[currentIndex].img})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 p-4 md:p-8 h-full flex flex-col justify-end">
        
        {/* Animated Tag */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="mb-auto flex justify-end pr-4 md:pr-6"
          >
            <div className={`bg-gradient-to-r ${premiumItems[currentIndex].tagColor} text-[8px] md:text-xs font-black uppercase tracking-wider px-2 py-0.5 md:px-4 md:py-1.5 rounded-full ${premiumItems[currentIndex].shadow}`}>
              {premiumItems[currentIndex].tag}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Animated Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full pr-6 md:pr-8"
          >
            <h3 className="text-2xl md:text-5xl font-black text-white mb-0.5 md:mb-1 tracking-tight drop-shadow-lg">
              {premiumItems[currentIndex].nameEn}
            </h3>
            <div className="flex items-center gap-2 mb-2 md:mb-6">
              <h4 className="text-lg md:text-3xl font-medium text-blue-200 font-serif italic drop-shadow-md">
                {premiumItems[currentIndex].nameBn}
              </h4>
              <span className="text-[8px] md:text-xs text-slate-300 bg-white/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded backdrop-blur-sm border border-white/10">
                {premiumItems[currentIndex].desc}
              </span>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg md:rounded-2xl p-3 md:p-5 mb-3 md:mb-5 shadow-lg">
              <div className="text-[8px] md:text-xs font-bold text-slate-300 uppercase tracking-wider mb-0.5 md:mb-1">Starting from</div>
              <div className="text-xl md:text-4xl font-black text-white">
                ₹{premiumItems[currentIndex].price}
                <span className="text-xs md:text-lg text-slate-400 font-bold">/{premiumItems[currentIndex].unit.replace('1 ', '')}</span>
              </div>
            </div>

            <button 
              onClick={() => addToCart(premiumItems[currentIndex], 1)}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white font-bold py-2 md:py-4 rounded-lg md:rounded-xl shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-all text-xs md:text-lg hover:scale-[1.02] active:scale-95"
            >
              Pre-order Now
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Vertical Pagination Indicators */}
      <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 md:gap-2 z-20">
        {premiumItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 md:w-2 rounded-full transition-all duration-500 ${
              currentIndex === idx ? 'h-6 md:h-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'h-1.5 md:h-2 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to item ${idx + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
