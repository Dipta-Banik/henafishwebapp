import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  product: any;
  quantity: number;
  customisation?: string;
  price: number;
}

export interface LocationInfo {
  lat?: number;
  lng?: number;
  address?: string;
}

export interface PlacedOrder {
  id: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  finalPrice: number;
  customer: any;
  date: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity?: number, customisation?: string, price?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  locationInfo: LocationInfo | null;
  setLocationInfo: (info: LocationInfo | null) => void;
  placedOrders: PlacedOrder[];
  addPlacedOrder: (order: PlacedOrder) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [placedOrders, setPlacedOrders] = useState<PlacedOrder[]>([]);

  const addToCart = (product: any, quantity = 1, customisation?: string, price?: number) => {
    setItems(prev => {
      const existing = prev.find(item => 
        item.product.id === product.id && 
        item.customisation === customisation
      );
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { id: Math.random().toString(), product, quantity, customisation, price: price || product.price }];
    });
  };

  const removeFromCart = (id: string) => setItems(prev => prev.filter(item => item.id !== id));
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setItems([]);

  const addPlacedOrder = (order: PlacedOrder) => setPlacedOrders(prev => [order, ...prev]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, locationInfo, setLocationInfo, placedOrders, addPlacedOrder }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
