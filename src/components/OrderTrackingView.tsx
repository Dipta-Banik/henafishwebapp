import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function OrderTrackingView() {
  const { placedOrders } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');
    setSearchedOrder(null);

    // Simulate network delay
    setTimeout(() => {
      const query = searchQuery.trim().toLowerCase();
      let order = placedOrders.find(
        (o) => o.id.toLowerCase() === query || o.customer?.phone === query
      );

      // For demo purposes: if no real order is found, generate a mock one
      // so users can see the tracking interface with any value.
      if (!order) {
        const isPhone = /^\d+$/.test(query);
        order = {
          id: isPhone ? `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : query.toUpperCase(),
          items: [
            { product: { nameEn: 'Premium Salmon Fillet' }, quantity: 2, price: 850 },
            { product: { nameEn: 'Tiger Prawns (Large)' }, quantity: 1, price: 1200 }
          ],
          total: 2900,
          deliveryFee: 50,
          finalPrice: 2950,
          customer: {
            name: 'Demo Customer',
            phone: isPhone ? query : '+91 9876543210',
            addressLine1: '123 Demo Street, Tech Park',
            pinCode: '100001'
          },
          // Set date to 15 minutes ago so it shows up as "Processing"
          date: new Date(Date.now() - 15 * 60000).toISOString()
        };
      }

      setSearchedOrder(order);
      setIsSearching(false);
    }, 800);
  };

  const getOrderStatus = (orderDateStr: string) => {
    const orderDate = new Date(orderDateStr);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - orderDate.getTime()) / 60000);

    if (diffMins >= 30) return 3; // Delivered
    if (diffMins >= 20) return 2; // Out for Delivery
    if (diffMins >= 5) return 1;  // Processing
    return 0; // Order Placed
  };

  return (
    <div className="relative max-w-4xl mx-auto py-12 px-4 min-h-[80vh] flex flex-col items-center justify-start">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-gradient-x"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-gradient-x" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-gradient-x" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="text-center mb-10 relative z-10 w-full">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">Track Your Order</h1>
        <p className="text-slate-600 text-lg font-medium">Enter your Order ID or Phone Number to get real-time updates.</p>
      </div>

      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-6 md:p-8 mb-8 relative z-10">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., ORD-1A2B3C4D5 or 9876543210"
              className="block w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 animate-gradient-x"
          >
            {isSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              'Track Order'
            )}
          </button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50/80 backdrop-blur-sm text-red-700 rounded-2xl border border-red-100/50 flex items-center gap-3"
          >
            <div className="bg-red-100 p-1.5 rounded-full">
              <Search size={16} className="text-red-600" />
            </div>
            <p className="font-medium text-sm">{error}</p>
          </motion.div>
        )}
      </div>

      {searchedOrder ? (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="w-full max-w-3xl bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 overflow-hidden relative z-10"
        >
          <div className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 backdrop-blur-md border-b border-slate-200/50 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Order ID</p>
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{searchedOrder.id}</h3>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Total Amount</p>
                <p className="text-xl font-black text-slate-800">₹{searchedOrder.finalPrice}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Order Date</p>
                <p className="text-base font-bold text-slate-800">
                  {new Date(searchedOrder.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <h4 className="font-black text-slate-800 mb-10 text-xl flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Truck size={18} />
              </span>
              Delivery Status
            </h4>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-100 rounded-full md:left-1/2 md:-ml-[2px]" />
              
              {/* Animated Progress Line */}
              <div 
                className="absolute left-6 top-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full md:left-1/2 md:-ml-[2px] transition-all duration-1000 ease-out"
                style={{ height: `${(getOrderStatus(searchedOrder.date) / 3) * 100}%` }}
              />

              <div className="space-y-10 relative">
                {[
                  { title: 'Order Placed', desc: 'We have received your order', icon: <Package size={22} />, step: 0 },
                  { title: 'Processing', desc: 'Your items are being packed', icon: <Clock size={22} />, step: 1 },
                  { title: 'Out for Delivery', desc: 'Your order is on the way', icon: <Truck size={22} />, step: 2 },
                  { title: 'Delivered', desc: 'Order has been delivered successfully', icon: <CheckCircle size={22} />, step: 3 },
                ].map((status, index) => {
                  const currentStep = getOrderStatus(searchedOrder.date);
                  const isCompleted = currentStep >= status.step;
                  const isCurrent = currentStep === status.step;

                  return (
                    <div key={index} className={`relative flex items-center md:justify-between gap-6 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="hidden md:block w-1/2" />
                      
                      <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-4 border-white flex items-center justify-center z-10 transition-all duration-500 shadow-md ${
                        isCompleted ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white scale-110' : 'bg-slate-100 text-slate-400'
                      } ${isCurrent ? 'ring-4 ring-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : ''}`}>
                        {status.icon}
                      </div>

                      <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                        <div className={`p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                          isCurrent ? 'bg-purple-50/80 border-purple-200 shadow-lg shadow-purple-100/50 scale-[1.02]' : 
                          isCompleted ? 'bg-white/60 border-slate-200/60' : 'bg-white/40 border-slate-100 opacity-70'
                        }`}>
                          <h5 className={`text-lg font-bold ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                            {status.title}
                          </h5>
                          <p className={`text-sm mt-1 font-medium ${isCompleted ? 'text-slate-500' : 'text-slate-400'}`}>
                            {status.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-50/80 backdrop-blur-md border-t border-slate-200/50 p-6 md:p-10">
            <h4 className="font-black text-slate-800 mb-6 text-lg">Order Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-slate-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Delivery Address</p>
                    <p className="text-sm text-slate-800 font-medium mt-1">
                      {searchedOrder.customer?.name}<br />
                      {searchedOrder.customer?.addressLine1}<br />
                      {searchedOrder.customer?.addressLine2 && <>{searchedOrder.customer.addressLine2}<br/></>}
                      {searchedOrder.customer?.pinCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-slate-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Contact Number</p>
                    <p className="text-sm text-slate-800 font-medium mt-1">{searchedOrder.customer?.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 mb-3">Items Ordered</p>
                <div className="space-y-2">
                  {searchedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-slate-700">
                        {item.quantity}x {item.product?.nameEn || 'Item'}
                      </span>
                      <span className="font-medium text-slate-800">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        placedOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mt-8 relative z-10"
          >
            <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Package className="text-indigo-500" /> Recent Orders
            </h3>
            <div className="space-y-4">
              {placedOrders.map((order) => (
                <div 
                  key={order.id} 
                  onClick={() => {
                    setSearchQuery(order.id);
                    handleSearch({ preventDefault: () => {} } as React.FormEvent);
                  }}
                  className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{order.id}</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium text-sm">
                      {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'} • ₹{order.finalPrice}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg">
                      {getOrderStatus(order.date) >= 3 ? (
                        <><CheckCircle size={16} className="text-emerald-500" /> Delivered</>
                      ) : getOrderStatus(order.date) >= 2 ? (
                        <><Truck size={16} className="text-indigo-500" /> Out for Delivery</>
                      ) : (
                        <><Clock size={16} className="text-amber-500" /> Processing</>
                      )}
                    </div>
                    <button className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      <Search size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}
