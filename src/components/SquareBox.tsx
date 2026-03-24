import { motion } from 'motion/react';
import { ShoppingCart, ArrowRight, Flame, Check } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

interface SquareBoxProps {
  onViewAll?: () => void;
}

export default function SquareBox({ onViewAll }: SquareBoxProps) {
  const { addToCart, items } = useCart();
  const { products, loading } = useProducts();
  
  // Get bestsellers from products data
  const bestsellers = [
    products.find(p => p.id === 'CP1') ? { ...products.find(p => p.id === 'CP1'), badge: "Top Choice" } : null, // Katla
    products.find(p => p.id === 'CP2'), // Rohu
    products.find(p => p.id === 'CP3'), // Katla Peti
  ].filter(Boolean) as any[];

  if (loading) return <div className="animate-pulse bg-slate-200 h-full min-h-[300px] rounded-3xl"></div>;
  if (bestsellers.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative h-full min-h-[300px] rounded-2xl md:rounded-3xl overflow-hidden group bg-white shadow-sm md:shadow-md shadow-slate-200/50 border border-slate-100 flex flex-col"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-slate-50/50 pointer-events-none" />
      
      <div className="relative p-3 md:p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 md:mb-5">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Flame className="text-orange-500 w-4 h-4 md:w-6 md:h-6" fill="currentColor" />
            <h3 className="text-base md:text-2xl font-extrabold text-slate-800 tracking-tight">Bestsellers</h3>
          </div>
          <span className="text-[9px] md:text-xs font-bold text-orange-700 bg-orange-100 px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider">High Demand</span>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-3 md:mb-5 flex-grow">
          
          {/* Featured Item (Large) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="w-full md:w-3/5 relative h-40 md:h-auto min-h-[160px] rounded-xl md:rounded-2xl overflow-hidden shadow-sm group/feat cursor-pointer"
          >
            <img src={bestsellers[0].img} alt={bestsellers[0].nameEn} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/feat:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            
            <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-red-500 text-white text-[8px] md:text-xs font-black uppercase px-2 py-1 rounded-md shadow-lg">
              {bestsellers[0].badge}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 flex justify-between items-end">
              <div>
                <h4 className="text-white font-bold text-sm md:text-2xl leading-tight drop-shadow-md">{bestsellers[0].nameEn}</h4>
                <p className="text-blue-200 text-[10px] md:text-sm font-medium">{bestsellers[0].nameBn}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="text-white font-black text-lg md:text-3xl drop-shadow-lg leading-none">₹{bestsellers[0].price}</div>
                <div className="text-white/70 text-[8px] md:text-[10px] uppercase font-bold mb-1 md:mb-2">{bestsellers[0].unit}</div>
                {(() => {
                  const isFeatInCart = items.some(i => i.product.id === bestsellers[0].id);
                  return (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(!isFeatInCart) addToCart(bestsellers[0], 1); }}
                      className={`${isFeatInCart ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-500'} text-white p-1.5 md:p-2.5 rounded-lg md:rounded-xl transition-colors shadow-lg flex items-center gap-1.5`}
                    >
                      {isFeatInCart ? <Check size={14} className="md:w-5 md:h-5" /> : <ShoppingCart size={14} className="md:w-5 md:h-5" />}
                      <span className="text-[10px] md:text-sm font-bold hidden sm:inline">{isFeatInCart ? 'Added' : 'Add'}</span>
                    </button>
                  );
                })()}
              </div>
            </div>
          </motion.div>

          {/* Small Items */}
          <div className="w-full md:w-2/5 grid grid-cols-2 md:flex md:flex-col gap-2 md:gap-3">
            {bestsellers.slice(1).map((product, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl p-2 md:p-3 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-2 md:gap-3 group/item cursor-pointer flex-1"
              >
                <div className="h-20 md:h-full md:w-24 rounded-lg overflow-hidden relative bg-slate-100 flex-shrink-0">
                  <img src={product.img} alt={product.nameEn} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs md:text-base leading-tight">{product.nameEn}</h4>
                    <span className="text-[9px] md:text-xs text-slate-500 font-medium">{product.nameBn}</span>
                  </div>
                  <div className="flex justify-between items-end mt-1 md:mt-0">
                    <div>
                      <div className="font-black text-blue-600 text-sm md:text-lg leading-none">₹{product.price}</div>
                      <div className="text-slate-400 text-[7px] md:text-[9px] uppercase font-bold mt-0.5">{product.unit}</div>
                    </div>
                    {(() => {
                      const isItemInCart = items.some(i => i.product.id === product.id);
                      return (
                        <button 
                          onClick={(e) => { e.stopPropagation(); if(!isItemInCart) addToCart(product, 1); }}
                          className={`${isItemInCart ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 hover:bg-blue-50 text-blue-600 border-slate-200 hover:border-blue-200'} p-1.5 md:p-2 rounded-lg transition-colors border`}
                        >
                          {isItemInCart ? <Check size={14} className="md:w-4 md:h-4" /> : <ShoppingCart size={14} className="md:w-4 md:h-4" />}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <button 
          onClick={onViewAll}
          className="w-full mt-auto py-2.5 md:py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs md:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn"
        >
          View All Products
          <ArrowRight size={14} className="md:w-4 md:h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
