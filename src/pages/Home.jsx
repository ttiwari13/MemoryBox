import React from 'react'
import Header from '../components/Header';
import HowToUse from '../components/HowToUse';
import UserX from '../components/UserX';
import FAQ from '../components/FAQ';
const Home = ({onGetStartedClick}) => {
  return (
    <>
     <Header onGetStartedClick={onGetStartedClick} />
     <HowToUse/>
     <UserX/>
     <FAQ/>
    </>
  )
}

export default Home;