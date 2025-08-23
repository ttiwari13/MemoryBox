import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Home from './pages/Home';
import LoginModal from './pages/LoginModal';
import SignModal from './pages/SignModal';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';

// Protected Route
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Main App Content
function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check session
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

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null);
          setActiveModal(null);
          navigate('/dashboard'); // Navigate to dashboard
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setActiveModal(null);
          navigate('/'); // Go back to home on logout
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Modal functions
  const openLoginModal = () => setActiveModal('login');
  const openSignupModal = () => setActiveModal('signup');
  const closeModal = () => setActiveModal(null);
  const switchToLogin = () => setActiveModal('login');
  const switchToSignup = () => setActiveModal('signup');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className={`${activeModal ? 'blur-sm' : ''} transition-all duration-300`}>
        <Routes>
          {/* HOME PAGE - Default route */}
          <Route 
            path="/" 
            element={
              <>
                <Home user={user} onGetStartedClick={openLoginModal} />
                <Footer />
              </>
            } 
          />
          
          {/* DASHBOARD - Protected route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />
          
          {/* DASHBOARD SUB-ROUTES - Protected routes */}
          <Route 
            path="/dashboard/quizzes" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/contact" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/medicines" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/tasks" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect any unknown routes to HOME */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Modals */}
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

// Main App Wrapper
function App() {
  return (
   
      <AppContent />
    
  );
}

export default App;