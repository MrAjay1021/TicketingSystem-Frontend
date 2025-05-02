import React from 'react';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection';
import CrmFeatures from '../components/CrmFeatures';
import PricingPlans from '../components/PricingPlans';

const Home = () => {
  return (
    <MainLayout>
      <HeroSection />
      <CrmFeatures />
      <PricingPlans />
    </MainLayout>
  );
};

export default Home; 