import React from "react";
import { User } from "lucide-react";
import img7 from '../assets/img7.jpg';

const Header = ({ onGetStartedClick }) => {
  return (
    <div className="relative overflow-hidden min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${img7})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
             
      {/* Header Section */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <h1 className="text-white text-lg sm:text-xl md:text-2xl font-semibold">
          Memory Box
        </h1>
      </header>
       
      {/* About Section */}
      <section className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center text-white">
          <h2 
            className="text-4xl sm:text-3xl md:text-6xl font-bold tracking-tight leading-tight mb-4 animate-fadeInUp"
          >
            Never Miss a Medication, Never Miss a Moment
          </h2>
                     
          <p 
            className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light mb-8 max-w-3xl mx-auto animate-fadeInUp animation-delay-200"
          >
            Caring for a loved one with Alzheimer's or dementia is one of life's greatest challenges. Memory Box transforms overwhelming caregiving into organized, confident care management
          </p>
                     
          <button
            className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-bold shadow-lg hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 animate-fadeInUp animation-delay-400"
            onClick={onGetStartedClick}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Add these CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Header;