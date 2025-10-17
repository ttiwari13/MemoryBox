import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; 
import Home from './pages/Home';
import LoginModal from './pages/LoginModal';
import SignModal from './pages/SignModal';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import UpdatePasswordModal from './pages/UpdatePasswordModal';
import Therapist from './pages/TherapistDashboard';

const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const handlePasswordUpdated = () => {
    setIsUpdatePasswordModalOpen(false);
    window.history.replaceState({}, document.title, "/"); 
    setActiveModal('login');
  };
  
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
        
        if (event === 'PASSWORD_RECOVERY') {
          setIsUpdatePasswordModalOpen(true);
          setActiveModal(null);
          return; 
        }
        
        if (event === 'SIGNED_IN') {
          const user = session?.user ?? null;
          setUser(user);
          setActiveModal(null);
          if (user) {
            const userRole = user.user_metadata?.role;
            console.log('User role:', userRole); 
            
            if (userRole === 'therapist') {
              navigate('/therapist');
            } else if (userRole === 'caregiver') {
              navigate('/dashboard');
            } else {
              navigate('/dashboard');
            }
          }
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
  
  const isAnyModalOpen = activeModal !== null || isUpdatePasswordModalOpen;

  return (
    <>
      <div className={`${isAnyModalOpen ? 'blur-sm' : ''} transition-all duration-300`}>
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Home user={user} onGetStartedClick={openLoginModal} />
                <Footer />
              </>
            } 
          />
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/therapist" 
            element={
              <ProtectedRoute user={user}>
                <Therapist user={user} />
              </ProtectedRoute>
            } 
          />
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

      {isUpdatePasswordModalOpen && (
        <UpdatePasswordModal onPasswordUpdated={handlePasswordUpdated} />
      )}
    </>
  );
}

export default App;