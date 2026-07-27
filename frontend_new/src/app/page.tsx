'use client';
import React, { useState, useEffect } from 'react';
import Hero from '../components/landing/Hero';
import PaketGrid from '../components/landing/PaketGrid';
import CoverageChecker from '../components/landing/CoverageChecker';
import PromoBanner from '../components/landing/PromoBanner';

export default function LandingPage() {
  const [cmsData, setCmsData] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    // Fetch CMS settings
    fetch('/api/cms')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCmsData(data.data);
        }
      })
      .catch(err => console.error('CMS fetch error:', err));

    // Fetch dynamic database plans
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.plans) {
          setPlans(data.plans);
        }
      })
      .catch(err => console.error('Plans fetch error:', err));
  }, []);

  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen font-sans">
      <Hero cmsData={cmsData} />
      <PaketGrid plansData={plans} />
      <CoverageChecker coverageText={cmsData?.landing_coverage || "Jaringan Fiber Optic Top Class Universal kini hadir di Pangandaran, Banjar, Ciamis, Tasikmalaya, dan Indramayu."} />
      <PromoBanner />
    </div>
  );
}
