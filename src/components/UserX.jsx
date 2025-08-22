import React, { useEffect, useState } from 'react'
import {motion,AnimatePresence, scale} from 'framer-motion'
import {Star } from 'lucide-react';
  const reviews = [
  {
    id: 1,
    name: "Aarav Sharma",
    review: "The website's UI is fantastic! Everything is so intuitive and easy to use. A truly seamless experience.",
    avatar: "https://placehold.co/150x150/F5CBA7/7D3D50?text=AS",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Singh",
    review: "I love the design and the smooth animations. It feels very premium and modern. Great job!",
    avatar: "https://placehold.co/150x150/C39BD3/3D3D50?text=PS",
    rating: 4,
  },
  {
    id: 3,
    name: "Vikram Kumar",
    review: "The user journey is very clear and straightforward. Found exactly what I was looking for without any hassle.",
    avatar: "https://placehold.co/150x150/A2D9CE/3D3D50?text=VK",
    rating: 5,
  },
  {
    id: 4,
    name: "Divya Gupta",
    review: "A beautifully crafted site. The performance is top-notch, even with all the visual elements.",
    avatar: "https://placehold.co/150x150/FADBD8/5a2334?text=DG",
    rating: 5,
  },
  {
    id: 5,
    name: "Karan Joshi",
    review: "The best part is the attention to detail. Every interaction feels polished and deliberate.",
    avatar: "https://placehold.co/150x150/A9CCE3/3D3D50?text=KJ",
    rating: 4,
  },
]  
const UserX = () => {
  const [currentReview,setCurrentReview]=useState(0);
  useEffect(()=>{
    const timer=setInterval(()=>{
       setCurrentReview((prev)=>(prev+1)%reviews.length);
    },5000);
    return ()=> clearInterval(timer);
  },[]);
  const carouselVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5, ease: "easeInOut" } },
  };
  return (
    <>
      <div className="relative overflow-hidden w-full py-16 px-4 md:px-8 bg-white min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#FF6B9D] mb-8 font-serif [text-shadow:2px_2px_4px_rgba(255,107,157,0.2)]">
          What Our Users Say
          </h2>
          <div className="relative w-full h-80 flex items-center justify-center mb-12">
            <AnimatePresence mode="wait">
              <motion.div 
                 key={currentReview}
                 variants={carouselVariants}
                 initial="initial"
                 animate="animate"
                 exit="exit"
                 className='w-full max-w-md p-8 bg-primary backdrop:blur-md rounded-3xl border border-gray-600 shadow-xl text-center flex flex-col items-center justify-center'>
                  <div className="flex items-center justify-center mb-4">
                     {[...Array(reviews[currentReview].rating)].map((_,i)=>(
                      <Star key={i} className='w-5 h-5 fill-yellow-400 text-yellow-400'/>
                      ))}
                      {[...Array(5 - reviews[currentReview].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gray-400 text-gray-400" />
                      ))}
                  </div>
                  <p className="text-base sm:text-lg italic text-gray-200 mb-4 font-serif">
                  "{reviews[currentReview].review}"
                  </p>
                  <span className="text-xl font-semibold text-[#FF6B9D]">{reviews[currentReview].name}</span>
                 </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative flex justify-center mt-12 space-x-3">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentReview ? 'bg-[#FF6B9D]' : 'bg-gray-500'
              }`}
              onClick={() => setCurrentReview(index)}
            />
          ))}
        </div>
        </div>
      </div>
    </>
  )
}

export default UserX