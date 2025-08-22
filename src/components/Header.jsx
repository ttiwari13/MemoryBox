import React from "react";
import { User } from "lucide-react";
import { motion } from 'framer-motion';
import img7 from '../assets/img7.jpg';

const Header = ({ onGetStartedClick }) => { // Fix: Accept props
  return (
    <div className="relative overflow-hidden min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${img7})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      {/* Header Section */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <h1 className="text-white text-lg sm:text-xl md:text-2xl font-semibold">
          Memory Box
        </h1>
        <div className="flex items-center gap-4">
          <motion.button 
            className="p-2 text-white border-2 border-transparent rounded-full hover:border-secondary transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <User className="size-4 sm:size-6 lg:size-8" />
          </motion.button>
        </div>
      </header>

      {/* About Section */}
      <section className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-3xl md:text-6xl font-bold tracking-tight leading-tight mb-4"
          >
            Never Miss a Medication, Never Miss a Moment
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light mb-8 max-w-3xl mx-auto"
          >
            Caring for a loved one with Alzheimer's or dementia is one of life's greatest challenges. Memory Box transforms overwhelming caregiving into organized, confident care management
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="px-8 py-4 bg-primary text-white rounded-full text-lg font-bold shadow-lg hover:bg-secondary transition-colors duration-300"
            onClick={onGetStartedClick} // Fix: Add onClick
          >
            Get Started
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default Header;