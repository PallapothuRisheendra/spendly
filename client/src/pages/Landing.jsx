import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Stats } from '../components/landing/Stats';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 text-dark-900 dark:text-white transition-colors">
      <LandingNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
};
