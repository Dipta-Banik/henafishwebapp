import { Home, LayoutGrid, Tag, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ViewState } from '../App';

interface BottomNavProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

export default function BottomNav({ currentView, setCurrentView }: BottomNavProps) {
  const { cartCount } = useCart();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-2">
        <button 
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentView === 'home' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
        >
          <Home size={22} />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </button>
        <button 
          onClick={() => setCurrentView('categories')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentView === 'categories' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
        >
          <LayoutGrid size={22} />
          <span className="text-[10px] font-medium mt-1">Categories</span>
        </button>
        <button 
          onClick={() => setCurrentView('offers')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentView === 'offers' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
        >
          <Tag size={22} />
          <span className="text-[10px] font-medium mt-1">Offers</span>
        </button>
        <button 
          onClick={() => setCurrentView('cart')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors relative ${currentView === 'cart' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
        >
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute top-2 right-[calc(50%-16px)] bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-white">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium mt-1">Cart</span>
        </button>
      </div>
    </div>
  );
}
