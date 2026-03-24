import { motion } from 'motion/react';
import { Sparkles, Gift } from 'lucide-react';

export default function OffersView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 md:py-12">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">Exclusive Offers</h1>
        <p className="text-slate-500 text-lg">Incredible deals are swimming your way.</p>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative group w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer min-h-[450px] flex flex-col items-center justify-center p-8 md:p-12 text-center border border-slate-100"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
          style={{ backgroundImage: 'url("src/images/offers_illish.webp")' }}
        />
        
        {/* 9-Color Looping Gradient Overlay */}
        <motion.div
          className="absolute inset-0 opacity-80 mix-blend-color"
          style={{
            background: 'linear-gradient(270deg, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #a855f7, #ec4899, #ef4444)',
            backgroundSize: '800% 800%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Second Gradient for depth and readability */}
        <motion.div
          className="absolute inset-0 opacity-60 mix-blend-multiply"
          style={{
            background: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #a855f7, #ec4899, #ef4444)',
            backgroundSize: '800% 800%',
          }}
          animate={{
            backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />

        {/* Card Content */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-2xl border border-white/30"
          >
            <Gift size={40} className="text-white drop-shadow-md md:w-12 md:h-12" />
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-xl leading-tight tracking-tight">
            Mega Hilsa <br className="md:hidden" /><span className="text-yellow-300">[Ilish Mach]</span> Fest
          </h2>
          
          <p className="text-white/95 font-medium mb-10 text-lg md:text-2xl max-w-xl drop-shadow-lg leading-relaxed">
            Get ready for the biggest discounts of the season on premium fresh catch!
          </p>
          
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/40 text-white px-8 py-4 rounded-full font-black shadow-2xl shadow-black/50 hover:bg-white/30 transition-all hover:scale-105 active:scale-95">
            <Sparkles size={20} className="text-yellow-300 animate-pulse" />
            <span className="tracking-widest uppercase text-sm md:text-base">Coming Soon</span>
            <Sparkles size={20} className="text-yellow-300 animate-pulse" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
