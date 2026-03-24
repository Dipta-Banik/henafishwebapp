import { useRef } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

interface VegetableCarouselProps {
  onViewAll?: () => void;
}

export default function VegetableCarousel({ onViewAll }: VegetableCarouselProps) {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const veg = products.filter(p => p.cat === 'vegetables');
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 200 : 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return <div className="animate-pulse bg-slate-200 h-full min-h-[200px] rounded-3xl"></div>;
  if (veg.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-emerald-100 shadow-sm md:shadow-md shadow-emerald-100/50 overflow-hidden relative group"
    >
      <div className="flex justify-between items-end mb-3 md:mb-6">
        <div>
          <h3 className="text-base md:text-2xl font-extrabold text-emerald-950 tracking-tight">Fresh Vegetables</h3>
          <p className="text-[10px] md:text-sm text-emerald-700 font-semibold mt-0.5 md:mt-1">Farm fresh daily essentials</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-1">
            <button 
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button 
            onClick={onViewAll}
            className="text-emerald-700 font-bold text-[10px] md:text-sm hover:underline bg-emerald-100/50 px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-colors hover:bg-emerald-200/50"
          >
            View All
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Mobile floating scroll buttons */}
        <button 
          onClick={() => scroll('left')}
          className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-r-xl bg-white/90 backdrop-blur border border-emerald-200 text-emerald-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={16} />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-l-xl bg-white/90 backdrop-blur border border-emerald-200 text-emerald-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={16} />
        </button>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto pb-3 md:pb-4 -mx-2 px-2 snap-x hide-scrollbar gap-2 md:gap-4 scroll-smooth"
        >
        {veg.map((item, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ scale: 1.03, y: -4 }}
            className="min-w-[100px] md:min-w-[200px] bg-white rounded-xl md:rounded-2xl p-2 md:p-3 shadow-sm hover:shadow-md border border-emerald-100/50 snap-start flex-shrink-0 group transition-all flex flex-col"
          >
            <div className="h-16 md:h-32 rounded-lg md:rounded-xl overflow-hidden mb-2 md:mb-3 bg-slate-100 relative">
              <img src={item.img} alt={item.nameEn} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <h4 className="font-bold text-slate-800 text-xs md:text-lg leading-tight">{item.nameEn}</h4>
            <div className="text-[9px] md:text-xs text-slate-500 font-medium mb-1.5 md:mb-3">{item.nameBn}</div>
            <div className="flex justify-between items-center mt-auto pt-1">
              <div className="font-black text-emerald-600 text-sm md:text-lg">₹{item.price}<span className="text-[7px] md:text-[10px] text-slate-400 font-bold uppercase">/{item.unit.replace('1 ', '')}</span></div>
              <button 
                onClick={() => addToCart(item, 1)}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 p-1 md:p-2 rounded-lg md:rounded-xl transition-colors"
              >
                <ShoppingCart size={12} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </motion.div>
  );
}
