import React, { useState } from 'react';
import Home from './pages/Home'; 
import LoginModal from './pages/LoginModal'; 
import Footer from './components/Footer';
function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
 
  return (
    <>
      {/* Home page with conditional blur effect */}
      <div className={`${isLoginModalOpen ? 'blur-sm' : ''} transition-all duration-300`}>
        <Home onGetStartedClick={() => setIsLoginModalOpen(true)} />
      </div>
 
      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
      <Footer/>
    </>
  );
}

export default App;