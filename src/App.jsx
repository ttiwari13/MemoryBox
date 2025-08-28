import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Home from './pages/Home';
import LoginModal from './pages/LoginModal';
import SignModal from './pages/SignModal';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';

// Protected Route Component
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Main App Content with all logic
function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null);
          setActiveModal(null);
         // navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setActiveModal(null);
          navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const openLoginModal = () => setActiveModal('login');
  const openSignupModal = () => setActiveModal('signup');
  const closeModal = () => setActiveModal(null);
  const switchToLogin = () => setActiveModal('login');
  const switchToSignup = () => setActiveModal('signup');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Memory Box...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${activeModal ? 'blur-sm' : ''} transition-all duration-300`}>
        <Routes>
          {/* Home Route */}
          <Route 
            path="/" 
            element={
              <>
                <Home user={user} onGetStartedClick={openLoginModal} />
                <Footer />
              </>
            } 
          />
          
          {/* Dashboard Routes - Proper hierarchy with wildcard matching */}
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
    </>
  );
}

// Main App Wrapper for Router
function App() {
  return (
   
      <AppContent />
   
  );
}

export default App;