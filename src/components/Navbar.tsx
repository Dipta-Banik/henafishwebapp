import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fish, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: 'home' | 'categories' | 'cart' | 'about' | 'contact' | 'offers' | 'tracking') => void;
}

export default function Navbar({ currentView, onViewChange }: NavbarProps) {
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'categories' | 'cart' | 'about' | 'contact' | 'offers' | 'tracking') => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => handleNavClick('home')}
            >
              <div className="bg-blue-600 p-1.5 md:p-2 rounded-lg md:rounded-xl text-white shadow-md shadow-blue-600/20">
                <Fish size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg md:text-xl leading-tight text-slate-900 tracking-tight">Hena Fish</span>
                <span className="text-[8px] md:text-[10px] font-bold text-blue-600 uppercase tracking-wider">Suppliers</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => handleNavClick('home')} className={`text-sm font-bold transition-colors ${currentView === 'home' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Home</button>
              <button onClick={() => handleNavClick('categories')} className={`text-sm font-bold transition-colors ${currentView === 'categories' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Shop</button>
              <button onClick={() => handleNavClick('offers')} className={`text-sm font-bold transition-colors ${currentView === 'offers' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Offers</button>
              <button onClick={() => handleNavClick('tracking')} className={`text-sm font-bold transition-colors ${currentView === 'tracking' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Track Order</button>
              <button onClick={() => handleNavClick('about')} className={`text-sm font-bold transition-colors ${currentView === 'about' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>About</button>
              <button onClick={() => handleNavClick('contact')} className={`text-sm font-bold transition-colors ${currentView === 'contact' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Contact</button>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={() => handleNavClick('cart')}
                className="relative p-1.5 md:p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ShoppingCart size={20} className="md:w-6 md:h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] md:text-[10px] font-bold w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 text-slate-700 hover:bg-slate-100 rounded-full transition-colors z-50 relative"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-20 md:hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              <button 
                onClick={() => handleNavClick('home')} 
                className={`text-2xl font-black text-left ${currentView === 'home' ? 'text-blue-600' : 'text-slate-800'}`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('categories')} 
                className={`text-2xl font-black text-left ${currentView === 'categories' ? 'text-blue-600' : 'text-slate-800'}`}
              >
                Shop
              </button>
              <button 
                onClick={() => handleNavClick('offers')} 
                className={`text-2xl font-black text-left ${currentView === 'offers' ? 'text-blue-600' : 'text-slate-800'}`}
              >
                Offers
              </button>
              <button 
                onClick={() => handleNavClick('tracking')} 
                className={`text-2xl font-black text-left ${currentView === 'tracking' ? 'text-blue-600' : 'text-slate-800'}`}
              >
                Track Order
              </button>
              <button 
                onClick={() => handleNavClick('about')} 
                className={`text-2xl font-black text-left ${currentView === 'about' ? 'text-blue-600' : 'text-slate-800'}`}
              >
                About Us
              </button>
              <button 
                onClick={() => handleNavClick('contact')} 
                className={`text-2xl font-black text-left ${currentView === 'contact' ? 'text-blue-600' : 'text-slate-800'}`}
              >
                Contact
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
