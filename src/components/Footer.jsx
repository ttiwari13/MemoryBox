import React from 'react';
import { Phone, Mail, MapPin} from "lucide-react";
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import img4 from '../assets/img4.png';
import img5 from '../assets/img5.png';
import { FaXTwitter,FaInstagram,FaFacebook} from "react-icons/fa6";

const Footer = () => {
  const images = [img1, img2, img3, img4, img5];

  return (
    <footer className="bg-primary text-white overflow-hidden">
      {/* Top border */}
      <div className="h-1" style={{background: `linear-gradient(to right, #979AD7, #383B6E)`}}></div>
      
      <div className="max-w-6xl mx-auto px-4 py-8 ml-7">
        {/* Main content with two columns */}
        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8 mb-8">
          
          {/* First Column: Navigation Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-secondary" >Quick Links</h3>
            <div className="flex flex-wrap justify-center md:flex-col md:justify-start space-x-4 md:space-x-0 md:space-y-2">
              <a href="#Quizes" className="text-gray-300 hover:text-white hover:pl-0 md:hover:pl-2 transition-all duration-200 block">
                Quizes
              </a>
              <a href="#Medicines" className="text-gray-300 hover:text-white hover:pl-0 md:hover:pl-2 transition-all duration-200 block">
                Medicines
              </a>
              <a href="#Tasks" className="text-gray-300 hover:text-white hover:pl-0 md:hover:pl-2 transition-all duration-200 block">
                Tasks
              </a>
              <a href="#Contact" className="text-gray-300 hover:text-white hover:pl-0 md:hover:pl-2 transition-all duration-200 block">
                Contact
              </a>
            </div>
          </div>

          {/* Second Column: Contact Information */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4" style={{color: '#979AD7'}}>Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-300">
                <Phone size={18} style={{color: '#979AD7'}} />
                <span className="text-sm sm:text-base">+1 (555) 123-4567</span>
              </div>
              
              <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-300">
                <Mail size={18} style={{color: '#979AD7'}} />
                <span className="text-sm sm:text-base">info@memorybox.com</span>
              </div>
              
              <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-300">
                <MapPin size={18} style={{color: '#979AD7'}} />
                <span className="text-sm sm:text-base">123 Memory Lane</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3 text-gray-400">Follow Us</h4>
              <div className="flex justify-center md:justify-start space-x-3">
                <button className="p-3 sm:p-2 bg-gray-800 rounded-full transition-colors duration-200 hover:bg-[#383B6E]">
                  <FaXTwitter size={20} />
                </button>
                <button className="p-3 sm:p-2 bg-gray-800 rounded-full transition-colors duration-200 hover:bg-[#383B6E]">
                  <FaFacebook size={20} />
                </button>
                <button className="p-3 sm:p-2 bg-gray-800 rounded-full transition-colors duration-200 hover:bg-[#383B6E]">
                  <FaInstagram size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
          
        {/* New full-width container for the Brand Section */}
        <div className="text-center mt-8 md:mt-12">
          <h2 className="text-2xl md:text-left lg:text-left md:text-3xl font-bold mb-2" style={{background: `linear-gradient(to right, #979AD7, #383B6E)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            MEMORY BOX
          </h2>
          <p className="text-gray-400 md:text-left lg:text-left text-sm mb-4">Preserving your precious memories</p>
          
          {/* Image Gallery */}
          <div className="md:hidden lg:hidden grid grid-cols-5 gap-1 sm:gap-2 max-w-sm mx-auto md:max-w-none md:mx-0 mt-7">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img 
                  src={img} 
                  alt={`Memory ${index + 1}`} 
                  className="w-full h-16 sm:h-20 md:h-16 object-cover rounded transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded transition-all duration-200 mt-7"></div>
              </div>
            ))}
          </div>
        </div>
         {/*images*/}
         <div className="">
            {images.map((img,index)=>{
                <div key={img} className="relative group">
                    <img 
                  src={img} 
                  alt={`Memory ${index + 1}`} 
                  className="w-full h-16 sm:hidden md:h-16 object-cover rounded transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded transition-all duration-200"></div>
                </div>
            })}
         </div>
        {/* Bottom section */}
        <div className="pt-6 border-t border-gray-700 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-gray-400 space-y-2 md:space-y-0">
            <div className="text-center md:text-left">
              © 2024 Memory Box. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms</a>
              <a href="#support" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;