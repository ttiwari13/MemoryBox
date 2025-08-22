import React, { useState } from 'react';
import Home from './pages/Home'; 
import LoginModal from './pages/LoginModal'; 
import SignModal from './pages/SignModal'; // Add this import
import Footer from './components/Footer';

function App() {
  const [activeModal, setActiveModal] = useState(null); // null, 'login', or 'signup'
 
  const openLoginModal = () => setActiveModal('login');
  const openSignupModal = () => setActiveModal('signup');
  const closeModal = () => setActiveModal(null);
  const switchToLogin = () => setActiveModal('login');
  const switchToSignup = () => setActiveModal('signup');

  return (
    <>
      <div className={`${activeModal ? 'blur-sm' : ''} transition-all duration-300`}>
        <Home onGetStartedClick={openLoginModal} />
      </div>
      {activeModal === 'login' && (
        <LoginModal 
          onClose={closeModal} 
          onSwitchToSignup={switchToSignup}
        />
      )}
      {activeModal === 'signup' && (
        <SignModal 
          onClose={closeModal} 
          onSwitchToLogin={switchToLogin}
        />
      )}
      
      <Footer/>
    </>
  );
}

export default App;