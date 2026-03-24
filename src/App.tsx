/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroBox from './components/HeroBox';
import SquareBox from './components/SquareBox';
import VerticalBox from './components/VerticalBox';
import VegetableCarousel from './components/VegetableCarousel';
import ParticleBackground from './components/ParticleBackground';
import BottomNav from './components/BottomNav';
import CategoryView from './components/CategoryView';
import CartView from './components/CartView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import OffersView from './components/OffersView';
import OrderTrackingView from './components/OrderTrackingView';
import FloatingCartBar from './components/FloatingCartBar';
import WelcomeSection from './components/WelcomeSection';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

export type ViewState = 'home' | 'categories' | 'cart' | 'about' | 'contact' | 'offers' | 'tracking';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');

  return (
    <ProductProvider>
      <CartProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
          <ParticleBackground />
          <Navbar currentView={currentView} onViewChange={setCurrentView} />
          
          <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-20 md:pb-12 relative z-10">
            {currentView === 'home' ? (
              <div className="flex flex-col gap-3 md:gap-6">
                {/* Welcome Section */}
                <WelcomeSection onViewCategories={() => setCurrentView('categories')} />
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 auto-rows-[minmax(140px,auto)]">
                  {/* Box 1: Full-width horizontal hero card */}
                  <div className="md:col-span-12">
                    <HeroBox />
                  </div>

                {/* Box 2: Square glowing card */}
                <div className="md:col-span-7 lg:col-span-8">
                  <SquareBox onViewAll={() => setCurrentView('categories')} />
                </div>

                {/* Box 3: Tall vertical card */}
                <div className="md:col-span-5 lg:col-span-4 md:row-span-2">
                  <VerticalBox />
                </div>

                {/* Box 4: Sliding vegetable card */}
                <div className="md:col-span-12 lg:col-span-8">
                  <VegetableCarousel onViewAll={() => setCurrentView('categories')} />
                </div>
              </div>
            </div>
          ) : currentView === 'categories' ? (
              <CategoryView />
            ) : currentView === 'offers' ? (
              <OffersView />
            ) : currentView === 'about' ? (
              <AboutView />
            ) : currentView === 'contact' ? (
              <ContactView />
            ) : currentView === 'tracking' ? (
              <OrderTrackingView />
            ) : (
              <CartView 
                onContinueShopping={() => setCurrentView('categories')} 
                onTrackOrder={() => setCurrentView('tracking')}
              />
            )}
          </main>

          <Footer />

          {currentView !== 'cart' && <FloatingCartBar onGoToCart={() => setCurrentView('cart')} />}
          <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
        </div>
      </CartProvider>
    </ProductProvider>
  );
}
