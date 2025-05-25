// Demo Mode Utilities
export function getIsDemoMode(): boolean {
  return import.meta.env.VITE_DEMO_MODE === 'true' || 
         sessionStorage.getItem('demo_mode') === 'true' ||
         window.location.search.includes('demo=true');
}

export function enableDemoMode() {
  sessionStorage.setItem('demo_mode', 'true');
}

export function disableDemoMode() {
  sessionStorage.removeItem('demo_mode');
}

// Demo Data Generators
export const demoEstimates = [
  {
    id: 'demo-1',
    projectName: 'Kitchen Renovation',
    projectType: 'kitchen',
    estimatedCost: 45000,
    timeline: '8-10 weeks',
    location: 'Denver, CO',
    breakdown: {
      materials: 18000,
      labor: 20000,
      permits: 1500,
      equipment: 3000,
      overhead: 2500
    },
    confidence: 'high',
    created: '2024-01-15'
  },
  {
    id: 'demo-2',
    projectName: 'Bathroom Remodel',
    projectType: 'bathroom',
    estimatedCost: 28000,
    timeline: '4-6 weeks',
    location: 'Denver, CO',
    breakdown: {
      materials: 12000,
      labor: 12000,
      permits: 800,
      equipment: 2200,
      overhead: 1000
    },
    confidence: 'medium',
    created: '2024-01-20'
  },
  {
    id: 'demo-3',
    projectName: 'Basement Finishing',
    projectType: 'basement',
    estimatedCost: 35000,
    timeline: '6-8 weeks',
    location: 'Denver, CO',
    breakdown: {
      materials: 15000,
      labor: 15000,
      permits: 1200,
      equipment: 2800,
      overhead: 1000
    },
    confidence: 'high',
    created: '2024-01-25'
  }
];

export const demoROIData = [
  {
    id: 'roi-1',
    projectType: 'Kitchen Remodel',
    investment: 45000,
    homeValueIncrease: 35000,
    roi: 78,
    timeToRecoup: '3-5 years',
    marketTrend: 'strong',
    recommendation: 'Excellent ROI for mid-range kitchen updates'
  },
  {
    id: 'roi-2',
    projectType: 'Bathroom Addition',
    investment: 28000,
    homeValueIncrease: 20000,
    roi: 71,
    timeToRecoup: '2-4 years',
    marketTrend: 'stable',
    recommendation: 'Solid investment, especially for homes with 1 bathroom'
  },
  {
    id: 'roi-3',
    projectType: 'Deck Addition',
    investment: 15000,
    homeValueIncrease: 12000,
    roi: 80,
    timeToRecoup: '1-2 years',
    marketTrend: 'strong',
    recommendation: 'High ROI outdoor improvement'
  }
];

export const demoPermitData = {
  '80202': {
    city: 'Denver',
    state: 'Colorado',
    department: 'Denver Community Planning & Development',
    phone: '(720) 865-2915',
    website: 'https://denvergov.org/Government/Departments/Community-Planning-and-Development',
    permits: {
      kitchen: ['Building Permit ($200-400)', 'Electrical Permit ($75-150)', 'Plumbing Permit ($100-200)'],
      bathroom: ['Building Permit ($150-300)', 'Electrical Permit ($75-150)', 'Plumbing Permit ($100-200)'],
      addition: ['Building Permit ($300-800)', 'Electrical Permit ($150-300)', 'Plumbing Permit ($150-300)', 'Mechanical Permit ($100-200)']
    }
  },
  '90210': {
    city: 'Beverly Hills',
    state: 'California',
    department: 'Beverly Hills Building & Safety',
    phone: '(310) 285-1014',
    website: 'https://beverlyhills.org/departments/communitydevelopment/buildingsafety/',
    permits: {
      kitchen: ['Building Permit ($250-500)', 'Electrical Permit ($100-200)', 'Plumbing Permit ($125-250)'],
      bathroom: ['Building Permit ($200-400)', 'Electrical Permit ($100-200)', 'Plumbing Permit ($125-250)'],
      addition: ['Building Permit ($400-1000)', 'Electrical Permit ($200-400)', 'Plumbing Permit ($200-400)', 'Mechanical Permit ($150-300)']
    }
  }
};

export const demoMaterialPrices = [
  {
    id: 'lumber-2x4-demo',
    name: 'Lumber 2x4x8',
    currentPrice: 8.75,
    unit: 'each',
    category: 'Lumber',
    trend: 'up',
    changePercent: 5.2,
    priceHistory: [
      { date: '2024-01-01', price: 8.20 },
      { date: '2024-01-15', price: 8.45 },
      { date: '2024-01-30', price: 8.75 }
    ]
  },
  {
    id: 'drywall-demo',
    name: 'Drywall 4x8 Sheet',
    currentPrice: 15.25,
    unit: 'sheet',
    category: 'Drywall',
    trend: 'stable',
    changePercent: 0.5,
    priceHistory: [
      { date: '2024-01-01', price: 15.15 },
      { date: '2024-01-15', price: 15.20 },
      { date: '2024-01-30', price: 15.25 }
    ]
  },
  {
    id: 'concrete-demo',
    name: 'Concrete Mix 80lb',
    currentPrice: 4.85,
    unit: 'bag',
    category: 'Concrete',
    trend: 'down',
    changePercent: -2.1,
    priceHistory: [
      { date: '2024-01-01', price: 4.95 },
      { date: '2024-01-15', price: 4.90 },
      { date: '2024-01-30', price: 4.85 }
    ]
  }
];

export const demoUserJourney = {
  'first-time-homeowner': {
    name: 'Sarah - First-Time Homeowner',
    background: 'Just bought a 1950s home, wants to update kitchen',
    goals: ['Understand renovation costs', 'Find reliable contractors', 'Plan timeline'],
    budget: '$25,000 - $50,000',
    experience: 'beginner',
    journey: [
      { step: 1, action: 'Visit Consumer Dashboard', tool: 'dashboard' },
      { step: 2, action: 'Use Renovation Concierge', tool: 'concierge' },
      { step: 3, action: 'Get Kitchen Estimate', tool: 'estimator' },
      { step: 4, action: 'Research Permits', tool: 'permit-research' },
      { step: 5, action: 'Chat with AI Assistant', tool: 'ai-assistant' }
    ]
  },
  'experienced-contractor': {
    name: 'Mike - General Contractor',
    background: '15 years experience, wants efficient bidding tools',
    goals: ['Speed up estimating', 'Track material costs', 'Manage multiple projects'],
    focus: 'efficiency',
    experience: 'expert',
    journey: [
      { step: 1, action: 'Check Dashboard Stats', tool: 'dashboard' },
      { step: 2, action: 'Quick Bid Estimator', tool: 'bid-estimator' },
      { step: 3, action: 'Monitor Material Prices', tool: 'material-prices' },
      { step: 4, action: 'Schedule Management', tool: 'scheduler' },
      { step: 5, action: 'AI Insights', tool: 'ai-assistant' }
    ]
  },
  'house-flipper': {
    name: 'David - Real Estate Investor',
    background: 'Flips 3-5 houses per year, ROI focused',
    goals: ['Maximize ROI', 'Quick property analysis', 'Cost optimization'],
    budget: '$100,000+ per project',
    experience: 'intermediate',
    journey: [
      { step: 1, action: 'Browse Property Listings', tool: 'real-estate-listings' },
      { step: 2, action: 'ROI Calculator', tool: 'roi-calculator' },
      { step: 3, action: 'Renovation Estimates', tool: 'estimator' },
      { step: 4, action: 'Market Analysis', tool: 'material-trends' },
      { step: 5, action: 'Portfolio Tracking', tool: 'flip-portfolio' }
    ]
  }
};