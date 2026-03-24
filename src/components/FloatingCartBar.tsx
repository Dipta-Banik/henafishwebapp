import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEffect, useState, useRef } from 'react';

export default function FloatingCartBar({ onGoToCart }: { onGoToCart: () => void }) {
  const { cartCount, cartTotal } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const prevCount = useRef(cartCount);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setJustAdded(true);
      const timer = setTimeout(() => setJustAdded(false), 2500);
      prevCount.current = cartCount;
      return () => clearTimeout(timer);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 150, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 150, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[400px] z-50"
        >
          <motion.button
            onClick={onGoToCart}
            animate={justAdded ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`w-full rounded-2xl p-2.5 md:p-4 shadow-2xl flex items-center justify-between transition-all active:scale-95 border relative overflow-hidden backdrop-blur-xl ${
              justAdded 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 shadow-blue-500/50 text-white' 
                : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400 border-white/20 shadow-[0_0_30px_rgba(6,182,212,0.4)] text-white hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]'
            }`}
          >
            {/* Ocean Animated Gradient Background */}
            {!justAdded && (
              <div className="absolute inset-0 opacity-90 mix-blend-overlay" style={{
                background: 'linear-gradient(120deg, #0284c7, #0ea5e9, #38bdf8, #2dd4bf, #0d9488, #0369a1)',
                backgroundSize: '300% 300%',
                animation: 'gradient-xy 6s ease-in-out infinite alternate'
              }} />
            )}

            {/* Ocean Wave Overlays */}
            {!justAdded && (
              <>
                <div className="absolute inset-0 opacity-30" style={{
                  background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.4) 0%, transparent 60%)',
                  animation: 'pulse 4s ease-in-out infinite alternate'
                }} />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-900/40 to-transparent pointer-events-none" />
              </>
            )}

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none" />

            {/* Shimmer effect when just added */}
            {justAdded && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            )}

            <div className="flex items-center gap-2.5 md:gap-3 relative z-10">
              <div className={`p-2 md:p-2.5 rounded-xl relative transition-colors shadow-inner ${justAdded ? 'bg-white/20' : 'bg-white/10 backdrop-blur-md border border-white/20'}`}>
                <AnimatePresence mode="wait">
                  {justAdded ? (
                    <motion.div
                      key="sparkles"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                    >
                      <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-yellow-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="bag"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <ShoppingBag className="w-4 h-4 md:w-6 md:h-6 text-white drop-shadow-md" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="text-left">
                <AnimatePresence mode="wait">
                  {justAdded ? (
                    <motion.div
                      key="added-text"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs md:text-base font-black text-white drop-shadow-md"
                    >
                      Added to Cart!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="count-text"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="text-[9px] md:text-xs text-white/80 font-bold uppercase tracking-wider drop-shadow-sm">{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</div>
                      <div className="text-sm md:text-lg font-black leading-none mt-0.5 text-white drop-shadow-md">₹{cartTotal}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 md:gap-2 font-black text-[10px] md:text-sm px-3 py-1.5 md:px-4 md:py-2 rounded-xl relative z-10 transition-colors shadow-inner border ${justAdded ? 'bg-white/20 text-white border-white/30' : 'bg-white/10 text-white border-white/20 backdrop-blur-md hover:bg-white/20'}`}>
              <span className="uppercase tracking-wide animate-pulse drop-shadow-md">{justAdded ? 'Checkout' : 'Go to Cart'}</span> <ChevronRight className="w-3 h-3 md:w-4 md:h-4 drop-shadow-md" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
