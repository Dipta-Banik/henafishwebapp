import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ChevronRight, ChevronDown, ChevronUp, ShieldCheck, Search, X, Check, Minus, Package, CalendarHeart, Users, PartyPopper, Sparkles, Phone, MessageCircle, Send, Clock, CalendarDays, MapPin, Loader2 } from 'lucide-react';
import { categories } from '../data/products';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

function ProductCard({ product, idx }: { key?: React.Key, product: any, idx: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCustomising, setIsCustomising] = useState(false);
  
  // Parse base weight and unit type
  const unitLower = product.unit.toLowerCase();
  const isWeightBased = unitLower.includes('g') || unitLower.includes('kg');
  
  let baseWeightKg = 1;
  if (isWeightBased) {
    const match = unitLower.match(/[\d.]+/);
    const num = match ? parseFloat(match[0]) : 1;
    if (unitLower.includes('kg')) {
      baseWeightKg = num;
    } else {
      baseWeightKg = num / 1000;
    }
  }

  const [selectedWeight, setSelectedWeight] = useState<number>(isWeightBased ? baseWeightKg : 1);

  const calculatedPrice = isWeightBased 
    ? Math.round((product.price / baseWeightKg) * selectedWeight)
    : Math.round(product.price * selectedWeight);

  const presets = isWeightBased 
    ? Array.from(new Set([baseWeightKg, 0.5, 1, 1.5, 2])).sort((a,b) => a-b).slice(0, 4)
    : [1, 2, 3, 4];

  const { addToCart, items, updateQuantity } = useCart();

  // Check if item is in cart with current delivery settings
  const cartItemsForProduct = items.filter(i => 
    i.product.id === product.id &&
    i.deliveryMode === 'instant'
  );
  const totalQty = cartItemsForProduct.reduce((sum, i) => sum + i.quantity, 0);
  const isInCart = totalQty > 0;

  // Consider description "long" if it's more than 25 characters
  const hasLongDesc = product.desc && product.desc.length > 25;

  const handleAddToCart = () => {
    if (product.customisable) {
      const customisation = isWeightBased
        ? (selectedWeight >= 1 ? `${selectedWeight} KG` : `${selectedWeight * 1000} g`)
        : `${selectedWeight} Unit${selectedWeight > 1 ? 's' : ''}`;
      addToCart(product, 1, customisation, calculatedPrice, 'instant');
      setIsCustomising(false);
    } else {
      addToCart(product, 1, undefined, undefined, 'instant');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
      className={`bg-white rounded-2xl p-2 md:p-4 shadow-sm border flex flex-col group hover:shadow-md transition-all relative overflow-hidden ${isInCart ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-100'}`}
    >
      <div className="flex gap-2.5 md:gap-4 w-full">
        {/* Product Image */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
          <img 
            src={product.img} 
            alt={product.nameEn} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {isInCart && (
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-bl-xl shadow-sm z-10 flex items-center gap-0.5">
              <Check size={10} strokeWidth={3} /> In Cart
            </div>
          )}
          {product.oldPrice && !isInCart && (
            <div className="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[8px] md:text-[10px] font-black px-1.5 py-0.5 rounded-br-lg shadow-sm tracking-wider">
              OFFER
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="flex flex-col flex-grow justify-between py-0.5 min-w-0">
          <div>
            <h3 className="font-extrabold text-slate-800 text-xs md:text-base leading-tight truncate">
              {product.nameEn}
            </h3>
            <p className="text-[10px] md:text-sm text-slate-500 font-medium mt-0.5 truncate">
              {product.nameBn}
            </p>
            
            {/* Expandable Description */}
            {product.desc && (
              <div className="mt-1 md:mt-1.5">
                <motion.div 
                  layout="position"
                  className={`text-[9px] md:text-xs text-slate-500 leading-snug ${isExpanded ? '' : 'line-clamp-1'}`}
                >
                  {product.desc}
                </motion.div>
                {hasLongDesc && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[8px] md:text-[10px] text-blue-600 font-bold mt-0.5 flex items-center gap-0.5 hover:text-blue-800 bg-blue-50/50 px-1.5 py-0.5 rounded"
                  >
                    {isExpanded ? (
                      <>Show less <ChevronUp size={10} /></>
                    ) : (
                      <>Read more <ChevronDown size={10} /></>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-end justify-between mt-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-black text-slate-900 text-sm md:text-lg leading-none">
                  ₹{product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-[9px] md:text-xs text-slate-400 line-through font-bold">
                    ₹{product.oldPrice}
                  </span>
                )}
              </div>
              <span className="text-[9px] md:text-xs text-slate-400 font-medium mt-0.5">
                {product.unit}
              </span>
            </div>
            
            {product.customisable ? (
              <button 
                onClick={() => {
                  setIsCustomising(!isCustomising);
                }}
                className={`text-[9px] md:text-xs font-extrabold px-2.5 py-1.5 md:px-4 md:py-2 rounded-lg border transition-colors shadow-sm flex items-center gap-0.5 ${isCustomising ? 'bg-blue-600 text-white border-blue-600' : isInCart ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white'}`}
              >
                {isCustomising ? 'Close' : isInCart ? 'Add More' : 'Customise'} {!isCustomising && <ChevronRight size={12} strokeWidth={3} />}
              </button>
            ) : isInCart ? (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-1">
                <button 
                  onClick={() => {
                    const item = cartItemsForProduct[0];
                    updateQuantity(item.id, item.quantity - 1);
                  }}
                  className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-4 md:w-5 text-center text-xs md:text-sm font-bold text-blue-800">
                  {totalQty}
                </span>
                <button 
                  onClick={() => {
                    const item = cartItemsForProduct[0];
                    updateQuantity(item.id, item.quantity + 1);
                  }}
                  className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleAddToCart}
                className={`text-[10px] md:text-xs font-extrabold px-4 py-1.5 md:px-5 md:py-2 rounded-lg border transition-colors shadow-sm ${'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white'}`}
              >
                ADD
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customise Panel */}
      <AnimatePresence>
        {isCustomising && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-slate-100 overflow-hidden"
          >
            <div className="flex gap-2 mb-3 bg-slate-100 p-1 rounded-lg">
              <button className="flex-1 bg-white text-blue-700 text-[10px] md:text-xs font-bold py-1.5 rounded shadow-sm">
                {isWeightBased ? 'By Weight (KG)' : 'Quantity'}
              </button>
              {isWeightBased && (
                <button className="flex-1 text-slate-400 text-[10px] md:text-xs font-bold py-1.5 cursor-not-allowed opacity-50" disabled>By Pieces (Soon)</button>
              )}
            </div>
            
            <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
              {presets.map(w => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-md text-[10px] md:text-xs font-bold border transition-colors ${selectedWeight === w ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {isWeightBased ? (w >= 1 ? `${w} KG` : `${w * 1000} g`) : `${w} Unit${w > 1 ? 's' : ''}`}
                </button>
              ))}
              <div className="flex items-center gap-1 border border-slate-200 rounded-md px-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <input 
                  type="number" 
                  step={isWeightBased ? "0.1" : "1"} 
                  min={isWeightBased ? "0.1" : "1"} 
                  placeholder="Custom" 
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(Number(e.target.value) || (isWeightBased ? baseWeightKg : 1))}
                  className="w-12 text-[10px] md:text-xs outline-none text-center font-bold text-slate-700 bg-transparent" 
                />
                <span className="text-[10px] md:text-xs text-slate-500 font-bold">{isWeightBased ? 'KG' : 'Qty'}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center bg-slate-50 p-2 md:p-3 rounded-xl border border-slate-100">
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Price</span>
                <span className="text-sm md:text-lg font-black text-slate-800">₹{calculatedPrice}</span>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white text-[10px] md:text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Add to Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CategoryView() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { setLocationInfo } = useCart();
  const { products, loading } = useProducts();

  const filteredProducts = products
    .filter(p => 
      (activeCategory === 'all' || p.cat === activeCategory) && 
      (p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
       p.nameBn.includes(searchQuery))
    )
    .sort((a, b) => {
      if (activeCategory !== 'all') return 0; // Don't sort if filtering by specific category
      const aIndex = categories.findIndex(cat => cat.id === a.cat);
      const bIndex = categories.findIndex(cat => cat.id === b.cat);
      return aIndex - bIndex;
    });
  

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-96px)] mt-4">
      
      <div className="flex flex-row flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Categories - Sidebar on both mobile and desktop */}
        <div className="w-[85px] md:w-[240px] bg-slate-50 border-r border-slate-200 flex-shrink-0 overflow-y-auto no-scrollbar">
              <div className="flex flex-col py-2 px-1 md:p-4 gap-2 md:gap-3">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-3 py-2 px-1 md:p-3 transition-all w-full relative rounded-xl md:rounded-2xl flex-shrink-0 ${
                    activeCategory === 'all' 
                      ? 'bg-white shadow-sm border border-slate-200/60 z-10' 
                      : 'hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  {activeCategory === 'all' && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full" />
                  )}
                  
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl flex-shrink-0 transition-colors mx-auto md:mx-0 ${activeCategory === 'all' ? 'bg-blue-50' : 'bg-slate-100'}`}>
                    🛍️
                  </div>
                  <div className="text-center md:text-left w-full px-0.5 md:px-0 flex flex-col justify-center">
                    <div className={`text-[9px] md:text-sm font-bold leading-tight break-words ${activeCategory === 'all' ? 'text-blue-700' : 'text-slate-700'}`}>
                      All Products
                    </div>
                    <div className={`text-[8px] md:text-xs font-medium mt-0.5 hidden md:block ${activeCategory === 'all' ? 'text-blue-500' : 'text-slate-500'}`}>
                      
                    </div>
                  </div>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-3 py-2 px-1 md:p-3 transition-all w-full relative rounded-xl md:rounded-2xl flex-shrink-0 ${
                      activeCategory === cat.id 
                        ? 'bg-white shadow-sm border border-slate-200/60 z-10' 
                        : 'hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    {activeCategory === cat.id && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full" />
                    )}
                    
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl flex-shrink-0 transition-colors mx-auto md:mx-0 ${activeCategory === cat.id ? 'bg-blue-50' : 'bg-slate-100'}`}>
                      {cat.icon}
                    </div>
                    <div className="text-center md:text-left w-full px-0.5 md:px-0 flex flex-col justify-center">
                      <div className={`text-[9px] md:text-sm font-bold leading-tight break-words ${activeCategory === cat.id ? 'text-blue-700' : 'text-slate-700'}`}>
                        {cat.nameEn}
                      </div>
                      <div className={`text-[8px] md:text-xs font-medium mt-0.5 hidden md:block ${activeCategory === cat.id ? 'text-blue-500' : 'text-slate-500'}`}>
                        {cat.nameBn}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content (Products) */}
            <div className="flex-1 overflow-y-auto p-2 md:p-6 bg-slate-50/50 relative">
              
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                  <p className="text-slate-500 font-medium">Loading products...</p>
                </div>
              ) : (
                <>
                  {/* Header & Search Area */}
                  <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-md pt-2 pb-3 px-1 md:px-0 mb-2 md:mb-4 flex items-center justify-between min-h-[60px]">
                    {!isSearchExpanded ? (
                  <>
                    <div>
                      <h2 className="text-base md:text-2xl font-extrabold text-slate-800">
                        {activeCategory === 'all' ? 'All Products' : categories.find(c => c.id === activeCategory && c.id != "Vegetables")?.nameEn}
                      </h2>
                      <p className="text-[10px] md:text-sm text-slate-500 font-medium mt-0.5">
                        {activeCategory === 'all' ? 'সব পণ্য' : categories.find(c => c.id === activeCategory)?.nameBn}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] md:text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full hidden md:block">
                        {filteredProducts.length} items
                      </div>
                      <button 
                        onClick={() => setIsSearchExpanded(true)}
                        className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
                      >
                        <Search size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, width: '80%' }}
                    animate={{ opacity: 1, width: '100%' }}
                    className="relative w-full flex items-center gap-2"
                  >
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text"
                        autoFocus
                        placeholder="Search in this category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        setIsSearchExpanded(false);
                        setSearchQuery('');
                      }}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2"
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Trust Banner for Fresh Cuts */}
              {activeCategory === 'fresh-cuts' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-3 md:p-4 text-white shadow-md flex items-center gap-3 overflow-hidden relative"
                >
                  <div className="absolute -right-4 -top-4 opacity-10 text-6xl">🔪</div>
                  <div className="flex-shrink-0 bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/10">
                    <ShieldCheck size={24} className="text-blue-300" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-black text-sm md:text-base text-white tracking-wide uppercase">100% Safe & Hygienic</h3>
                    <p className="text-[9px] md:text-xs text-slate-300 mt-0.5 font-medium leading-snug">Expertly cut, washed with RO water, and vacuum packed for ultimate freshness.</p>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 md:gap-4 pb-4">
                {filteredProducts.map((product, idx) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    idx={idx} 
                  />
                ))}
              </div>
              </>
              )}
            </div>
      </div>
    </div>
  );
}
