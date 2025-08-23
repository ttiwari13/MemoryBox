import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import HowToUse from '../components/HowToUse';
import UserX from '../components/UserX';
import FAQ from '../components/FAQ';

const Home = ({ user, onGetStartedClick }) => {
  const navigate = useNavigate();

  // If user is already logged in, they can go to dashboard
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      onGetStartedClick(); // Open login modal
    }
  };

  return (
    <>
      <Header 
        user={user}
        onGetStartedClick={handleGetStarted}
      />
      <HowToUse />
      <UserX />
      <FAQ />
    </>
  );
};

export default Home;