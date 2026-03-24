import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, MessageCircle, Facebook, Instagram } from 'lucide-react';

export default function ContactView() {
  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-12 pt-4 md:pt-8 px-4 space-y-10 md:space-y-16">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4 md:mb-6 shadow-inner">
          <MessageSquare size={28} className="text-indigo-600" />
        </div>
        <h1 className="text-3xl md:text-6xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight">
          Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Touch</span>
        </h1>
        <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed px-4">
          Have a question about an order, wholesale pricing, or just want to say hello? We'd love to hear from you.
        </p>
      </motion.div>

      {/* Map Location */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full h-64 md:h-96 rounded-3xl overflow-hidden shadow-xl relative group border border-slate-200"
      >
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14736.273418512215!2d88.4154!3d22.6373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89e3002300001%3A0x7000000000000000!2sGorabazar%2C%20Dum%20Dum%20Cantonment%2C%20Kolkata!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale group-hover:grayscale-0 transition-all duration-700"
        ></iframe>
        <div className="absolute inset-0 pointer-events-none border-4 border-white/20 rounded-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-4 left-4 right-4 md:left-8 md:right-auto bg-white/95 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3 md:gap-4">
          <div className="bg-blue-600 p-2.5 md:p-3 rounded-xl text-white shadow-md">
            <MapPin size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-sm md:text-base">Our Hub</h3>
            <p className="text-xs md:text-sm font-medium text-slate-500">Gorabazar, Dumdum, Kolkata</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Contact Information */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 relative overflow-hidden flex flex-col justify-center"
        >
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 md:mb-6">Contact Information</h2>
          <p className="text-slate-500 mb-6 md:mb-8 font-medium text-sm md:text-base">
            Reach out to us directly through your preferred channel. We're always here to help!
          </p>

          <div className="space-y-4">
            {/* WhatsApp Button */}
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 md:p-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 transition-all group">
              <div className="bg-[#25D366] p-3 rounded-xl text-white shadow-lg shadow-[#25D366]/30 group-hover:scale-110 transition-transform">
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#128C7E] text-xs md:text-sm uppercase tracking-wider">WhatsApp Us</h3>
                <p className="text-base md:text-lg font-black text-slate-800">+91 076860 61789</p>
              </div>
            </a>

            {/* Call Button */}
            <a href="tel:+919876543210" className="flex items-center gap-4 p-3 md:p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all group">
              <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-blue-700 text-xs md:text-sm uppercase tracking-wider">Call Us</h3>
                <p className="text-base md:text-lg font-black text-slate-800">+91 076860 61789</p>
              </div>
            </a>

            {/* Email Button */}
            <a href="mailto:support@henafish.com" className="flex items-center gap-4 p-3 md:p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-all group">
              <div className="bg-rose-500 p-3 rounded-xl text-white shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-rose-700 text-xs md:text-sm uppercase tracking-wider">Email Us</h3>
                <p className="text-base md:text-lg font-black text-slate-800">experimentallapp@gmail.com</p>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Send us a Message (Form) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black mb-2">Send us a Message</h2>
            <p className="text-slate-400 mb-6 md:mb-8 font-medium text-sm md:text-base">We'll get back to you as soon as possible.</p>
            
            <form className="space-y-4 md:space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] md:text-xs font-bold text-slate-300 uppercase tracking-wider">First Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 md:py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all backdrop-blur-sm text-sm"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] md:text-xs font-bold text-slate-300 uppercase tracking-wider">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 md:py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all backdrop-blur-sm text-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 md:py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all backdrop-blur-sm text-sm"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-bold text-slate-300 uppercase tracking-wider">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 md:py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none backdrop-blur-sm text-sm"
                  placeholder="How can we help you?"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-3.5 md:py-4 rounded-xl shadow-lg shadow-blue-900/50 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-[0.98] flex justify-center items-center gap-2 mt-2 text-sm md:text-base"
              >
                Send Message <Send size={18} />
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Social Media (Last) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center justify-center pt-8 md:pt-12 pb-4 border-t border-slate-200"
      >
        <h3 className="text-lg md:text-xl font-black text-slate-800 mb-6 md:mb-8">Connect With Us</h3>
        <div className="flex items-center gap-8 md:gap-12">
          {/* Facebook */}
          <a href="https://www.facebook.com/profile.php?id=61586707243252#" className="flex flex-col items-center gap-2 md:gap-3 group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-[#1877F2]/30 group-hover:-translate-y-1">
              <Facebook size={28} strokeWidth={2.5} className="md:w-8 md:h-8" />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-500 group-hover:text-[#1877F2] transition-colors">Facebook</span>
          </a>
          
          {/* Instagram */}
          <a href="#" className="flex flex-col items-center gap-2 md:gap-3 group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] p-[2px] group-hover:-translate-y-1 transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-[#e1306c]/30">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-[#e1306c] group-hover:bg-transparent group-hover:text-white transition-colors duration-300">
                <Instagram size={28} strokeWidth={2.5} className="md:w-8 md:h-8" />
              </div>
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-500 group-hover:text-[#e1306c] transition-colors">Instagram</span>
          </a>

          {/* WhatsApp */}
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 md:gap-3 group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-[#25D366]/30 group-hover:-translate-y-1">
              <MessageCircle size={28} strokeWidth={2.5} className="md:w-8 md:h-8" />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-500 group-hover:text-[#25D366] transition-colors">WhatsApp</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
