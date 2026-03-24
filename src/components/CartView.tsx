import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Tag, Info, MapPin, User, Phone, Home, FileSpreadsheet, Zap, Compass, X, Loader2, CheckCircle, Package, PartyPopper, ChevronRight, Mail, CreditCard, Copy, Map, Navigation, Calendar, Sun, Moon, Edit3 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

export default function CartView({ onContinueShopping, onTrackOrder }: { onContinueShopping: () => void, onTrackOrder?: () => void }) {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal, locationInfo, setLocationInfo, placedOrders, addPlacedOrder } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'delivery'>('cart');
  const [addressOption, setAddressOption] = useState<'map' | 'form' | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showInstantPopup, setShowInstantPopup] = useState(false);
  const [showScheduleCalendar, setShowScheduleCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState({ 
    name: '', 
    phone: '', 
    addressLine1: '',
    addressLine2: '',
    buildingName: '',
    landmark: '',
    pinCode: '',
    email: '',
    deliveryType: '' as 'instant' | 'schedule' | '',
    scheduledDate: '' as string,
    scheduledPeriod: '' as 'morning' | 'evening' | '',
    scheduledSlot: '' as string
  });
  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const [pinCodeVerified, setPinCodeVerified] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);
  
  const [showCelebration, setShowCelebration] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string | null>(null);

  const [showMinOrderPopup, setShowMinOrderPopup] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  const HUB_COORDS = { lat: 22.63601423742518, lng: 88.41766640582809 };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const getDeliveryFee = (distance: number, type: string) => {
    if (type === 'schedule') return 0;
    if (distance <= 1.0) return 10;
    if (distance <= 1.5) return 15;
    if (distance <= 2.0) return 20;
    if (distance <= 3.0) return 30;
    if (distance <= 4.0) return 40;
    return 50;
  };

  const MIN_ORDER_VALUE = 350;
  const minOrderRemaining = MIN_ORDER_VALUE - cartTotal;
  const finalPrice = cartTotal + deliveryFee;
  const isBelowMinOrder = cartTotal < MIN_ORDER_VALUE;

  React.useEffect(() => {
    if (calculatedDistance !== null) {
      const fee = getDeliveryFee(calculatedDistance, customerData.deliveryType);
      setDeliveryFee(fee);
    }
  }, [calculatedDistance, customerData.deliveryType]);

  const MORNING_SLOTS = [
    "08:00 AM - 08:30 AM", "08:30 AM - 09:00 AM", "09:00 AM - 09:30 AM", "09:30 AM - 10:00 AM",
    "10:00 AM - 10:30 AM", "10:30 AM - 11:00 AM", "11:00 AM - 11:30 AM", "11:30 AM - 12:00 PM",
    "12:00 PM - 12:30 PM", "12:30 PM - 01:00 PM"
  ];

  const EVENING_SLOTS = [
    "05:00 PM - 05:30 PM", "05:30 PM - 06:00 PM", "06:00 PM - 06:30 PM", "06:30 PM - 07:00 PM",
    "07:00 PM - 07:30 PM", "07:30 PM - 08:00 PM", "08:00 PM - 08:30 PM", "08:30 PM - 09:00 PM"
  ];

  const getNextFourDays = () => {
    const days = [];
    for (let i = 0; i < 4; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        full: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        iso: date.toISOString().split('T')[0]
      });
    }
    return days;
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using OpenStreetMap Nominatim for reverse geocoding
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await response.json();
          
          if (data && data.address) {
            const addr = data.address;
            const fullAddress = data.display_name;
            const pinCode = addr.postcode || '';
            
            setCustomerData(prev => ({
              ...prev,
              addressLine1: fullAddress,
              pinCode: pinCode
            }));
            
            if (pinCode.length === 6) {
              setPinCodeVerified(true);
            }
            
            setLocationInfo({
              lat: latitude,
              lng: longitude,
              address: fullAddress
            });

            setCheckoutStep('delivery');
            setAddressOption('form'); // Show the form with pre-filled data
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          alert("Could not fetch address details. Please fill manually.");
          setAddressOption('form');
          setCheckoutStep('delivery');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please fill the address manually.");
        setIsLocating(false);
        setAddressOption('form');
        setCheckoutStep('delivery');
      }
    );
  };

  const handleWhatsAppOrder = async () => {
    const mandatoryFields = [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Mobile Number' },
      { key: 'buildingName', label: 'Flat / House No. / Building Name' },
      { key: 'addressLine1', label: 'Street Address / Area' },
      { key: 'pinCode', label: 'PIN Code' }
    ];

    for (const field of mandatoryFields) {
      if (!customerData[field.key as keyof typeof customerData]) {
        alert(`Please fill in the mandatory field: ${field.label}`);
        return;
      }
    }

    if (customerData.pinCode === '700028' || customerData.pinCode === '700065') {
        if (!customerData.deliveryType) {
            alert("Please select a delivery type (Instant or Schedule).");
            return;
        }
        if (customerData.deliveryType === 'schedule' && (!customerData.scheduledDate || !customerData.scheduledPeriod || !customerData.scheduledSlot)) {
            alert("Please select a date, period, and time slot for scheduled delivery.");
            return;
        }
    }

    setIsGenerating(true);

    try {
      const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Prepare data for Supabase
      const orderData = {
        order_id: orderId,
        customer_name: customerData.name,
        customer_phone: customerData.phone,
        customer_email: customerData.email,
        address: {
          building: customerData.buildingName,
          street: customerData.addressLine1,
          landmark: customerData.landmark,
          pincode: customerData.pinCode
        },
        delivery_type: customerData.deliveryType,
        scheduled_date: customerData.scheduledDate,
        scheduled_period: customerData.scheduledPeriod,
        scheduled_slot: customerData.scheduledSlot,
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.nameEn,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: cartTotal,
        delivery_fee: deliveryFee,
        final_price: finalPrice,
        status: 'pending'
      };

      // Save to Supabase
      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

      // Add to local state
      addPlacedOrder({
        id: orderId,
        items: [...items],
        total: cartTotal,
        deliveryFee,
        finalPrice,
        customer: { ...customerData },
        date: new Date().toISOString()
      });

      setGeneratedOrderId(orderId);

      // Prepare WhatsApp message
      const message = `New Order!
Order ID: ${orderId}
Name: ${customerData.name}
Phone: ${customerData.phone}
Email: ${customerData.email}
Address: ${customerData.buildingName}, ${customerData.addressLine1}, ${customerData.landmark}, PIN: ${customerData.pinCode}
Delivery Type: ${customerData.deliveryType}${customerData.deliveryType === 'schedule' ? `\nDate: ${customerData.scheduledDate}\nPeriod: ${customerData.scheduledPeriod}\nTime: ${customerData.scheduledSlot}` : ''}${calculatedDistance !== null ? `\nDistance: ${calculatedDistance.toFixed(2)} km` : ''}
Items:
${items.map(item => `${item.product.nameEn} x ${item.quantity}`).join('\n')}
Total: ₹${finalPrice}`;
      
      const whatsappUrl = `https://wa.me/918145403418?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      // Clear cart and show celebration
      clearCart();
      setShowCelebration(true);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    if (generatedOrderId) {
      navigator.clipboard.writeText(generatedOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (showCelebration) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
        >
          {/* Confetti / Celebration Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute top-10 left-10 text-4xl"
            >
              🎉
            </motion.div>
            <motion.div 
              animate={{ 
                y: [0, -30, 0],
                rotate: [0, -15, 15, 0]
              }}
              transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
              className="absolute top-20 right-10 text-4xl"
            >
              ✨
            </motion.div>
            <motion.div 
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 20, -20, 0]
              }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 1 }}
              className="absolute bottom-20 left-20 text-4xl"
            >
              🎊
            </motion.div>
          </div>

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
          >
            <PartyPopper size={48} />
          </motion.div>
          
          <h2 className="text-3xl font-black text-slate-800 mb-2">Hooray!</h2>
          <p className="text-slate-600 font-medium mb-6">Your order has been placed successfully.</p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-8">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Order ID</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg font-black text-slate-800 tracking-wide">{generatedOrderId}</span>
              <button 
                onClick={handleCopyOrderId}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors active:scale-95"
                title="Copy Order ID"
              >
                {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
            </div>
            {copied && <p className="text-xs text-emerald-600 font-bold mt-2">Copied to clipboard!</p>}
          </div>

          <button 
            onClick={() => {
              setShowCelebration(false);
              if (onTrackOrder) onTrackOrder();
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex justify-center items-center gap-2 text-lg"
          >
            Track Order <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  const orderToView = viewingOrderId ? placedOrders.find(o => o.id === viewingOrderId) : null;

  if (orderToView) {
    return (
      <div className="max-w-3xl mx-auto pb-24 md:pb-12 pt-4 md:pt-8 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 text-center relative overflow-hidden mb-6"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle size={40} />
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">Order Placed!</h2>
          <p className="text-slate-500 font-medium mb-1">Order ID: <span className="text-slate-800 font-bold">{orderToView.id}</span></p>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-4">
            Thank you for choosing Hena Fish Suppliers! 🐟<br/><br/>
            Our delivery team will connect with you on WhatsApp shortly to confirm your delivery and ensure maximum freshness.
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                <Package size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Order Items</h3>
                <p className="text-xs text-slate-500">Items included in this order.</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {orderToView.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">{item.product.nameEn}</span>
                    <span className="text-xs text-slate-400">× {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-800">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Subtotal</span>
                <span className="font-black text-blue-600">
                  ₹{orderToView.total}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-50 rounded-2xl p-5 border border-slate-200"
          >
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-blue-500" /> Billing Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Total Item Value</span>
                <span className="font-medium">₹{orderToView.total}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span>
                  {orderToView.deliveryFee === 0 ? (
                    <><del className="text-slate-400 mr-2">₹40</del><span className="text-emerald-600 font-bold">Free</span></>
                  ) : (
                    <span className="font-medium">₹{orderToView.deliveryFee}</span>
                  )}
                </span>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800">Total Amount to Pay</span>
                <span className="text-xl font-black text-blue-600">₹{orderToView.finalPrice}</span>
              </div>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => {
              setViewingOrderId(null);
            }}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Hide Details & Start New Order <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    );
  }

  const BlinkingBanner = () => {
    if (placedOrders.length === 0) return null;
    return (
      <div className="max-w-5xl mx-auto px-4 pt-4 md:pt-6">
        <motion.button
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={() => setViewingOrderId(placedOrders[0].id)}
          className="w-full bg-blue-50 border border-blue-200 text-blue-700 py-3 px-4 rounded-xl flex items-center justify-between shadow-sm hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Package size={20} className="text-blue-500" />
            <div className="text-left">
              <p className="text-sm font-bold">Previous Order Placed</p>
              <p className="text-xs opacity-80">ID: {placedOrders[0].id} • Tap to view details</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-blue-400" />
        </motion.button>
      </div>
    );
  };

  if (items.length === 0) {
    return (
      <>
        <BlinkingBanner />
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[20%] left-[10%] w-[50vw] h-[50vw] bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-indigo-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-32 h-32 md:w-40 md:h-40 bg-white/60 backdrop-blur-2xl border border-white/80 rounded-full flex items-center justify-center mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative"
          >
            <div className="absolute inset-2 border border-blue-100 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
            <ShoppingBag size={48} className="text-blue-500 md:w-16 md:h-16 relative z-10" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight">Your cart is empty</h2>
          <p className="text-slate-500 mb-10 max-w-sm text-base md:text-lg font-medium">Looks like you haven't added anything to your cart yet. Explore our fresh products!</p>
          <button 
            onClick={onContinueShopping}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-3 text-lg"
          >
            Start Shopping <ArrowRight size={20} />
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <BlinkingBanner />
      <div className="relative max-w-6xl mx-auto pb-32 md:pb-16 pt-4 md:pt-8 px-3 sm:px-6 lg:px-8 min-h-screen">
        {/* Subtle background texture */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        </div>

        <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <ShoppingBag className="text-blue-600" size={32} />
            My Cart
          </h2>
          <span className="bg-white/80 backdrop-blur-md text-blue-700 font-bold px-4 py-1.5 rounded-full text-sm border border-blue-100 shadow-sm">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          
          {/* Stepper Header */}
          {checkoutStep !== 'cart' && (
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setCheckoutStep('cart')}
                className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-md transition-all border border-slate-200/60"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
              <div className="flex-1 flex items-center justify-center bg-white/60 backdrop-blur-md p-3 px-5 rounded-2xl border border-white/40 shadow-sm">
                <span className="text-sm font-bold text-blue-800">Checkout Details</span>
              </div>
            </div>
          )}

          {checkoutStep === 'cart' && (
            <>
              {/* Fast Delivery Info */}
              <div className="mb-6 space-y-3">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-yellow-200/60 p-4 rounded-2xl flex items-start gap-3 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600 flex-shrink-0">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 mb-0.5">Fast Delivery Available!</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Fast delivery is available only for pin codes <span className="text-blue-600 font-bold">700028</span> and <span className="text-blue-600 font-bold">700065</span>.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                      className="bg-white/80 backdrop-blur-xl p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-slate-100/50 flex flex-col gap-2 group hover:border-blue-200 transition-all"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col min-w-0 flex-1">
                          <h4 className="font-bold text-slate-800 text-sm md:text-base truncate">{item.product.nameEn}</h4>
                          <p className="text-[10px] md:text-xs text-slate-500 truncate">{item.product.nameBn}</p>
                          
                          {item.customisation && (
                            <span className="inline-block mt-1 bg-slate-100 text-slate-600 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200 w-fit">
                              {item.customisation}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-300 hover:text-red-500 p-1 transition-colors bg-slate-50 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div className="font-black text-slate-900 text-sm md:text-base">
                            ₹{item.price}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 bg-blue-50 text-blue-700">
                            Fresh Item
                          </span>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-slate-100/80 backdrop-blur-sm border border-slate-200/60 rounded-lg p-0.5 shadow-inner">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-white rounded-md transition-all active:scale-90"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 md:w-8 text-center text-xs md:text-sm font-black text-slate-800">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-white rounded-md transition-all active:scale-90"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Address Prompt - Moved after items */}
              <div id="address-section" className="mt-8 space-y-4">
                {addressOption === null ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-xl border border-blue-100 p-5 rounded-3xl shadow-sm border-dashed border-2"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-800">Delivery Address Required</h4>
                        <p className="text-sm text-slate-500 font-medium">How would you like to provide your address?</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        onClick={handleGetCurrentLocation}
                        disabled={isLocating}
                        className="flex items-center gap-4 p-4 rounded-2xl border-2 border-blue-100 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-300 transition-all text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                          {isLocating ? <Loader2 size={20} className="animate-spin" /> : <Navigation size={20} />}
                        </div>
                        <div>
                          <span className="block font-bold text-slate-800 text-sm">Use Current Location</span>
                          <span className="block text-[10px] text-slate-500 font-medium">Detect address using GPS</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => {
                          setAddressOption('form');
                          setCheckoutStep('delivery');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 transition-transform">
                          <FileSpreadsheet size={20} />
                        </div>
                        <div>
                          <span className="block font-bold text-slate-800 text-sm">Fill Address Form</span>
                          <span className="block text-[10px] text-slate-500 font-medium">Manually enter details</span>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-emerald-500" />
                      <span className="text-sm font-bold text-emerald-800">Address details provided</span>
                    </div>
                    <button 
                      onClick={() => setAddressOption(null)}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      Change
                    </button>
                  </motion.div>
                )}
              </div>
            </>
          )}

          {checkoutStep === 'delivery' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden p-5 md:p-8 space-y-8 relative pb-32 lg:pb-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-[spin_8s_linear_infinite]"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-[spin_10s_linear_infinite_reverse]"></div>

              {!isConfirmed ? (
                <form id="delivery-form" className="space-y-4">
                  {/* Contact Form */}
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Name *" 
                      value={customerData.name}
                      onChange={(e) => setCustomerData(prev => ({...prev, name: e.target.value.replace(/[^a-zA-Z\s]/g, '')}))}
                      className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm"
                      required
                    />
                    <input 
                      type="email" 
                      placeholder="Email (Optional)" 
                      value={customerData.email}
                      onChange={(e) => setCustomerData(prev => ({...prev, email: e.target.value}))}
                      className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm"
                    />
                    <input 
                      type="number" 
                      placeholder="Mobile Number *" 
                      value={customerData.phone}
                      onChange={(e) => setCustomerData(prev => ({...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10)}))}
                      className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm"
                      required
                    />
                  </div>

                  {/* Address Fields */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Home size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Flat / House No. / Building Name *" 
                      value={customerData.buildingName}
                      onChange={(e) => setCustomerData(prev => ({...prev, buildingName: e.target.value}))}
                      className="w-full pl-11 pr-4 py-3.5 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400 shadow-sm"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Street Address / Area *" 
                      value={customerData.addressLine1}
                      onChange={(e) => setCustomerData(prev => ({...prev, addressLine1: e.target.value}))}
                      className="w-full pl-11 pr-4 py-3.5 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400 shadow-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Compass size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Landmark (Optional)" 
                        value={customerData.landmark}
                        onChange={(e) => setCustomerData(prev => ({...prev, landmark: e.target.value}))}
                        className="w-full pl-11 pr-4 py-3.5 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400 shadow-sm"
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="PIN Code *" 
                        value={customerData.pinCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setCustomerData(prev => ({...prev, pinCode: val}));
                          if (val.length === 6) {
                            setPinCodeVerified(true);
                          } else {
                            setPinCodeVerified(false);
                          }
                        }}
                        className={`w-full pl-11 pr-4 py-3.5 bg-white/90 backdrop-blur-sm border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all placeholder:text-slate-400 shadow-sm ${pinCodeVerified ? 'border-emerald-500 ring-emerald-500/10' : 'border-slate-200/80 focus:ring-emerald-500/10 focus:border-emerald-500'}`}
                        required
                      />
                      <AnimatePresence>
                        {(customerData.pinCode === '700028' || customerData.pinCode === '700065') && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8, x: 10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 10 }}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                          >
                            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                              <Zap size={10} fill="currentColor" /> FAST
                            </div>
                          </motion.div>
                        )}
                        {pinCodeVerified && !(customerData.pinCode === '700028' || customerData.pinCode === '700065') && (
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <CheckCircle size={18} className="text-emerald-500" />
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  {(customerData.pinCode === '700028' || customerData.pinCode === '700065') && (
                    <div className="mt-6 space-y-6">
                      <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 backdrop-blur-sm">
                        <label className="block text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                          <Zap size={16} className="text-amber-500 fill-amber-500" /> Select Delivery Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            type="button" 
                            onClick={() => setCustomerData(prev => ({...prev, deliveryType: 'instant'}))} 
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${customerData.deliveryType === 'instant' ? 'border-emerald-500 bg-white shadow-lg shadow-emerald-500/10 scale-[1.02]' : 'border-slate-100 bg-white/50 hover:border-slate-200'}`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${customerData.deliveryType === 'instant' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                              <Zap size={20} fill={customerData.deliveryType === 'instant' ? 'currentColor' : 'none'} />
                            </div>
                            <span className={`text-sm font-bold ${customerData.deliveryType === 'instant' ? 'text-emerald-900' : 'text-slate-600'}`}>Instant</span>
                            <span className="text-[10px] text-slate-400 font-medium">30-45 Mins</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setCustomerData(prev => ({...prev, deliveryType: 'schedule'}))} 
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${customerData.deliveryType === 'schedule' ? 'border-blue-500 bg-white shadow-lg shadow-blue-500/10 scale-[1.02]' : 'border-slate-100 bg-white/50 hover:border-slate-200'}`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${customerData.deliveryType === 'schedule' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                              <Calendar size={20} />
                            </div>
                            <span className={`text-sm font-bold ${customerData.deliveryType === 'schedule' ? 'text-blue-900' : 'text-slate-600'}`}>Schedule</span>
                            <span className="text-[10px] text-slate-400 font-medium">Pick a Slot</span>
                          </button>
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {customerData.deliveryType === 'instant' && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-5 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4"
                          >
                            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex-shrink-0 flex items-center justify-center">
                              <Zap size={20} fill="currentColor" />
                            </div>
                            <div>
                              <h4 className="font-bold text-amber-900 text-sm mb-1">⚡ Lightning-fast delivery at your doorstep!</h4>
                              <p className="text-xs text-amber-800/70 leading-relaxed">Delivery charges vary depending on your location. Our rider will reach you within 30-45 minutes.</p>
                            </div>
                          </motion.div>
                        )}

                        {customerData.deliveryType === 'schedule' && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                          >
                            {/* Date Selection */}
                            <div className="space-y-3">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Date</label>
                              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                                {getNextFourDays().map((day, idx) => {
                                  const colors = [
                                    { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', hover: 'hover:border-blue-200' },
                                    { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', hover: 'hover:border-emerald-200' },
                                    { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', hover: 'hover:border-amber-200' },
                                    { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', hover: 'hover:border-purple-200' }
                                  ];
                                  const color = colors[idx % colors.length];
                                  return (
                                    <button
                                      key={day.iso}
                                      type="button"
                                      onClick={() => setCustomerData(prev => ({...prev, scheduledDate: day.full}))}
                                      className={`flex-shrink-0 px-5 py-3 rounded-2xl border-2 transition-all flex flex-col items-center min-w-[100px] ${customerData.scheduledDate === day.full ? `${color.border} ${color.bg} ${color.text} shadow-md scale-[1.05]` : `border-slate-100 bg-white text-slate-600 ${color.hover}`}`}
                                    >
                                      <span className="text-[10px] font-bold uppercase opacity-60">{day.full.split(' ')[0]}</span>
                                      <span className="text-sm font-black">{day.full.split(' ').slice(1).join(' ')}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Period Selection */}
                            {customerData.scheduledDate && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-3"
                              >
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Period</label>
                                <div className="grid grid-cols-2 gap-3">
                                  <button 
                                    type="button" 
                                    onClick={() => setCustomerData(prev => ({...prev, scheduledPeriod: 'morning', scheduledSlot: ''}))} 
                                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${customerData.scheduledPeriod === 'morning' ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-lg shadow-amber-500/10' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
                                  >
                                    <Sun size={18} className={customerData.scheduledPeriod === 'morning' ? 'text-amber-500' : 'text-slate-400'} />
                                    <span className="font-bold text-sm">Morning</span>
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={() => setCustomerData(prev => ({...prev, scheduledPeriod: 'evening', scheduledSlot: ''}))} 
                                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${customerData.scheduledPeriod === 'evening' ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-lg shadow-indigo-500/10' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
                                  >
                                    <Moon size={18} className={customerData.scheduledPeriod === 'evening' ? 'text-indigo-500' : 'text-slate-400'} />
                                    <span className="font-bold text-sm">Evening</span>
                                  </button>
                                </div>
                              </motion.div>
                            )}

                            {/* Slot Selection */}
                            <AnimatePresence mode="wait">
                              {customerData.scheduledPeriod === 'morning' && (
                                <motion.div 
                                  key="morning-slots"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  className="space-y-3"
                                >
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Sun size={14} className="text-amber-500" /> Morning Slots (8:00 AM – 1:00 PM)
                                  </label>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {MORNING_SLOTS.map((slot) => (
                                      <button
                                        key={slot}
                                        type="button"
                                        onClick={() => setCustomerData(prev => ({...prev, scheduledSlot: slot}))}
                                        className={`py-2.5 px-3 rounded-xl border text-[10px] font-bold transition-all ${customerData.scheduledSlot === slot ? 'bg-amber-500 border-amber-500 text-white shadow-md' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}
                                      >
                                        {slot}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}

                              {customerData.scheduledPeriod === 'evening' && (
                                <motion.div 
                                  key="evening-slots"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  className="space-y-3"
                                >
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Moon size={14} className="text-indigo-500" /> Evening Slots (5:00 PM – 9:00 PM)
                                  </label>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {EVENING_SLOTS.map((slot) => (
                                      <button
                                        key={slot}
                                        type="button"
                                        onClick={() => setCustomerData(prev => ({...prev, scheduledSlot: slot}))}
                                        className={`py-2.5 px-3 rounded-xl border text-[10px] font-bold transition-all ${customerData.scheduledSlot === slot ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}
                                      >
                                        {slot}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <button 
                    type="button"
                    disabled={isCalculatingDistance}
                    onClick={async () => {
                      // Validation
                      if (!customerData.name || !customerData.phone || !customerData.buildingName || !customerData.addressLine1 || !customerData.pinCode) {
                        alert("Please fill all mandatory fields");
                        return;
                      }
                      if (customerData.pinCode === '700028' || customerData.pinCode === '700065') {
                        if (!customerData.deliveryType) {
                          alert("Please select a delivery type (Instant or Schedule).");
                          return;
                        }
                        if (customerData.deliveryType === 'schedule' && (!customerData.scheduledDate || !customerData.scheduledPeriod || !customerData.scheduledSlot)) {
                          alert("Please select a date, period, and time slot for scheduled delivery.");
                          return;
                        }
                      }

                      setIsCalculatingDistance(true);
                      try {
                        let userCoords = locationInfo;

                        // If we don't have coordinates (manual entry), try to geocode
                        if (!userCoords || !userCoords.lat) {
                          const fullAddress = `${customerData.buildingName}, ${customerData.addressLine1}, Kolkata ${customerData.pinCode}, West Bengal, India`;
                          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`);
                          const data = await response.json();
                          
                          if (data && data.length > 0) {
                            userCoords = {
                              lat: parseFloat(data[0].lat),
                              lng: parseFloat(data[0].lon),
                              address: data[0].display_name
                            };
                            setLocationInfo(userCoords);
                          } else {
                            // Fallback if geocoding fails - use a default distance or ask user
                            // For now, let's assume a default fee if geocoding fails, but alert the user
                            console.warn("Geocoding failed for address:", fullAddress);
                          }
                        }

                        if (userCoords && userCoords.lat) {
                          const dist = calculateDistance(HUB_COORDS.lat, HUB_COORDS.lng, userCoords.lat, userCoords.lng);
                          setCalculatedDistance(dist);
                          const fee = getDeliveryFee(dist, customerData.deliveryType);
                          setDeliveryFee(fee);
                        } else {
                          // If still no coordinates, set a default fee based on pincode or something
                          setDeliveryFee(customerData.deliveryType === 'schedule' ? 0 : 20);
                        }

                        setIsConfirmed(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } catch (error) {
                        console.error("Error calculating distance:", error);
                        setIsConfirmed(true); // Still confirm but maybe with default fee
                      } finally {
                        setIsCalculatingDistance(false);
                      }
                    }}
                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl mt-8 shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isCalculatingDistance ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Calculating Distance...
                      </>
                    ) : (
                      "Confirm Details"
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-black text-slate-800">Delivery Summary</h4>
                    <button 
                      onClick={() => setIsConfirmed(false)} 
                      className="flex items-center gap-1.5 text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <User size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Customer</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{customerData.name}</p>
                        <p className="text-xs text-slate-500">{customerData.phone}</p>
                        {customerData.email && <p className="text-xs text-slate-500">{customerData.email}</p>}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Address</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {customerData.buildingName}, {customerData.addressLine1}
                        {customerData.landmark && <><br />Landmark: {customerData.landmark}</>}
                        <br />PIN: {customerData.pinCode}
                      </p>
                    </div>
                  </div>

                  {customerData.deliveryType && (
                    <div className={`p-4 rounded-2xl border flex items-center gap-4 ${customerData.deliveryType === 'instant' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${customerData.deliveryType === 'instant' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'}`}>
                        {customerData.deliveryType === 'instant' ? <Zap size={20} fill="currentColor" /> : <Calendar size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${customerData.deliveryType === 'instant' ? 'text-amber-600' : 'text-blue-600'}`}>
                              {customerData.deliveryType === 'instant' ? 'Instant Delivery' : 'Scheduled Delivery'}
                            </p>
                            <p className="text-sm font-bold text-slate-800">
                              {customerData.deliveryType === 'instant' 
                                ? 'Within 30-45 minutes' 
                                : `${customerData.scheduledDate} (${customerData.scheduledPeriod}) at ${customerData.scheduledSlot}`}
                            </p>
                          </div>
                          {calculatedDistance !== null && customerData.deliveryType === 'instant' && (
                            <div className="text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Distance</p>
                              <p className="text-sm font-black text-slate-800">{calculatedDistance.toFixed(2)} km</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white/80 backdrop-blur-2xl p-5 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 sticky top-24 pb-32 lg:pb-8">
            <h3 className="text-lg md:text-xl font-black text-slate-800 mb-5 md:mb-6 flex items-center gap-2">
              <FileSpreadsheet className="text-blue-500" size={20} /> Bill Details
            </h3>
            
            {/* Item List inside Bill Details */}
            <div className="mb-6 space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col min-w-0 flex-1 pr-2">
                      <h4 className="font-bold text-slate-800 text-xs md:text-sm truncate">{item.product.nameEn}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{item.product.nameBn}</p>
                    </div>
                    <span className="font-bold text-slate-800 text-xs md:text-sm whitespace-nowrap">₹{item.price * item.quantity}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[9px] md:text-[10px] text-slate-500">
                    <span className="bg-slate-200/70 px-1.5 py-0.5 rounded font-medium">ID: {item.product.id}</span>
                    <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium capitalize">{item.product.cat.replace('-', ' ')}</span>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{item.product.unit}</span>
                    <span className="font-bold text-slate-700 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">Qty: {item.quantity}</span>
                  </div>
                  
                  {item.customisation && (
                    <div className="text-[9px] md:text-[10px] text-slate-500 mt-1">
                      <span className="font-medium">Details:</span> {item.customisation}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="w-full h-px bg-slate-200/60 mb-5"></div>
            
            <div className="space-y-2.5 md:space-y-3 text-xs md:text-sm text-slate-600 mb-5 md:mb-6">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><ShoppingBag size={12} className="md:w-3.5 md:h-3.5 text-slate-400"/> Item Total</span>
                <span className="font-bold text-slate-800">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><Truck size={12} className="md:w-3.5 md:h-3.5 text-slate-400"/> Delivery Fee</span>
                <span className="font-bold text-slate-800">₹{deliveryFee}</span>
              </div>
              
              <div className="flex justify-between items-center text-emerald-600">
                <span className="flex items-center gap-1.5"><Tag size={12} className="md:w-3.5 md:h-3.5" /> Item Discount</span>
                <span className="font-bold">-₹0</span>
              </div>

              <div className="h-px bg-slate-100 my-3 md:my-4" />
              
              <div className="flex justify-between items-end">
                <div>
                  <span className="font-black text-slate-800 text-base md:text-lg">To Pay</span>
                  <div className="text-[9px] md:text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <Info size={10} /> Inclusive of all taxes
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl md:text-2xl font-black text-slate-900 leading-none">
                    ₹{finalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary Plain Text */}
            <div className="mt-6 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info size={14} className="text-blue-500" /> Order & Delivery Summary
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your order is processed immediately upon confirmation. Fresh items are carefully packed to ensure quality. Delivery times may vary based on your location and selected slot. For Cash on Delivery, please keep exact change ready.
              </p>
            </div>
            
            <div className="mt-6">
              <AnimatePresence mode="wait">
                {checkoutStep === 'cart' ? (
                  <motion.button 
                    key="cart-btn"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => {
                      if (isBelowMinOrder) {
                        setShowMinOrderPopup(true);
                        return;
                      }
                      if (addressOption === null) {
                        const element = document.getElementById('address-section');
                        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        return;
                      }
                      setCheckoutStep('delivery');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={isBelowMinOrder}
                    className={`w-full text-white font-black py-3.5 md:py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex justify-between items-center px-6 md:px-8 text-base md:text-lg ${
                      isBelowMinOrder 
                        ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex flex-col items-start text-left">
                      <span className="text-[10px] md:text-xs font-bold text-blue-100 uppercase tracking-wider">Total</span>
                      <span className="text-lg md:text-xl leading-none">₹{finalPrice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isBelowMinOrder ? 'Min. ₹350 Required' : addressOption === null ? 'Select Address' : 'Checkout'} 
                      <ArrowRight size={20} className="md:w-6 md:h-6" />
                    </div>
                  </motion.button>
                ) : (
                  isConfirmed ? (
                    <motion.button 
                      key="place-order-btn"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleWhatsAppOrder}
                      disabled={isGenerating}
                      className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-3.5 md:py-5 rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex justify-between items-center px-6 md:px-8 text-base md:text-lg ${isGenerating ? 'opacity-80 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex flex-col items-start text-left">
                        <span className="text-[10px] md:text-xs font-bold text-emerald-100 uppercase tracking-wider">Final Amount</span>
                        <span className="text-lg md:text-xl leading-none">₹{finalPrice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isGenerating ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Placing Order...
                          </>
                        ) : (
                          <>
                            Place Order <ArrowRight size={20} className="md:w-6 md:h-6" />
                          </>
                        )}
                      </div>
                    </motion.button>
                  ) : (
                    <motion.div 
                      key="confirm-msg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl text-center text-sm border border-slate-200 border-dashed"
                    >
                      Please confirm details to place order
                    </motion.div>
                  )
                )}
              </AnimatePresence>
              
              {checkoutStep === 'cart' && isBelowMinOrder && (
                <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-[10px] md:text-xs font-bold">
                  <Info size={14} />
                  <span>Add ₹{minOrderRemaining} more to proceed with delivery (Min. ₹350)</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 md:mt-5 flex items-center justify-center gap-1.5 md:gap-2 text-[9px] md:text-xs text-slate-500 font-medium bg-slate-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-slate-100">
              <ShieldCheck size={14} className="md:w-4 md:h-4 text-emerald-500" />
              Secure checkout & fresh delivery guaranteed
            </div>
          </div>
        </div>
      </div>

      {/* Minimum Order Value Popup */}
      <AnimatePresence>
        {showMinOrderPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-red-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-rose-500" />
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <ShoppingBag size={20} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">Minimum Order</h3>
                </div>
                <button 
                  onClick={() => setShowMinOrderPopup(false)}
                  className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1"
                >
                  <Minus size={16} className="rotate-45" />
                </button>
              </div>

              <div className="text-center py-4">
                <div className="text-5xl mb-4">🛒</div>
                <p className="text-slate-600 font-medium mb-2">Delivery is applicable for minimum <span className="text-slate-800 font-bold">₹350/-</span></p>
                <p className="text-lg font-black text-red-600 mb-6">Add ₹{minOrderRemaining} more to make 350</p>
                
                <button
                  onClick={() => {
                    setShowMinOrderPopup(false);
                    onContinueShopping();
                  }}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-900/20"
                >
                  Add More Items
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
