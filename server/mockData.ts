// Mock data for house flipping tools - Kensington, MD focused
// Replace with real API integrations when available

export const mockListings = [
  {
    id: "1",
    address: "123 Summit Ave, Kensington, MD 20895",
    price: 485000,
    sqft: 1850,
    bedrooms: 3,
    bathrooms: 2,
    daysOnMarket: 45,
    status: "active",
    zipCode: "20895",
    description: "Charming colonial with original hardwood floors. Needs kitchen and bathroom updates.",
    listingUrl: "https://example.com/listing1",
    photos: []
  },
  {
    id: "2", 
    address: "456 Howard Ave, Kensington, MD 20895",
    price: 525000,
    sqft: 2100,
    bedrooms: 4,
    bathrooms: 2,
    daysOnMarket: 28,
    status: "active",
    zipCode: "20895",
    description: "Split level home with finished basement. Good bones, cosmetic updates needed.",
    listingUrl: "https://example.com/listing2",
    photos: []
  },
  {
    id: "3",
    address: "789 Connecticut Ave, Kensington, MD 20895", 
    price: 445000,
    sqft: 1650,
    bedrooms: 3,
    bathrooms: 1,
    daysOnMarket: 72,
    status: "active",
    zipCode: "20895",
    description: "Ranch style home on large lot. Needs full renovation but great potential.",
    listingUrl: "https://example.com/listing3",
    photos: []
  },
  {
    id: "4",
    address: "321 Plyers Mill Rd, Kensington, MD 20895",
    price: 610000,
    sqft: 2400,
    bedrooms: 4,
    bathrooms: 3,
    daysOnMarket: 15,
    status: "active", 
    zipCode: "20895",
    description: "Updated colonial with modern kitchen. Move-in ready but priced high.",
    listingUrl: "https://example.com/listing4",
    photos: []
  }
];

export const mockPermits = [
  {
    id: "1",
    permitNumber: "P24-001234",
    address: "123 Summit Ave, Kensington, MD 20895",
    status: "approved",
    scopeOfWork: "Kitchen renovation including electrical and plumbing updates",
    issueDate: "2024-03-15",
    inspectionDate: "2024-04-20",
    finalDate: "2024-05-10",
    permitType: "Residential Renovation",
    contractorName: "ABC Contractors LLC",
    estimatedValue: 45000
  },
  {
    id: "2",
    permitNumber: "P24-001156", 
    address: "456 Howard Ave, Kensington, MD 20895",
    status: "active",
    scopeOfWork: "Basement finishing with new electrical circuits",
    issueDate: "2024-04-01",
    inspectionDate: "2024-05-15",
    permitType: "Electrical",
    contractorName: "DEF Electric",
    estimatedValue: 25000
  },
  {
    id: "3",
    permitNumber: "P23-009876",
    address: "789 Connecticut Ave, Kensington, MD 20895", 
    status: "expired",
    scopeOfWork: "HVAC system replacement",
    issueDate: "2023-09-10",
    inspectionDate: "2023-10-15",
    permitType: "Mechanical",
    contractorName: "Cool Air HVAC",
    estimatedValue: 12000
  }
];

export const mockFlipProjects = [
  {
    id: "1",
    address: "987 Plyers Mill Rd, Kensington, MD 20895",
    startDate: "2024-01-15",
    finishDate: "2024-04-20",
    beforePhotos: [],
    afterPhotos: [],
    scopeOfWork: ["Kitchen remodel", "Bathroom renovation", "Hardwood refinishing", "Paint interior"],
    budgetPlanned: 75000,
    budgetActual: 82000,
    salePrice: 635000,
    timeline: 95,
    status: "sold",
    roi: 24.2
  },
  {
    id: "2",
    address: "654 Howard Ave, Kensington, MD 20895", 
    startDate: "2024-03-01",
    finishDate: "2024-06-15",
    beforePhotos: [],
    afterPhotos: [],
    scopeOfWork: ["Full gut renovation", "New HVAC", "Electrical upgrade", "New roof"],
    budgetPlanned: 125000,
    budgetActual: 135000,
    salePrice: 725000,
    timeline: 106,
    status: "completed",
    roi: 18.5
  },
  {
    id: "3",
    address: "432 Summit Ave, Kensington, MD 20895",
    startDate: "2024-05-01",
    beforePhotos: [],
    afterPhotos: [],
    scopeOfWork: ["Kitchen update", "Bathroom remodel", "Flooring"],
    budgetPlanned: 65000,
    budgetActual: 68000,
    timeline: 0,
    status: "in-progress"
  }
];

// AI analysis examples for development
export const generateMockAIAnalysis = (type: string, data: any): string => {
  switch (type) {
    case 'listing':
      const { price, sqft, daysOnMarket } = data.listing;
      const pricePerSqft = Math.round(price / sqft);
      if (pricePerSqft < 280) {
        return `This property at $${pricePerSqft}/sqft is priced below market average for Kensington. With ${daysOnMarket} days on market, there may be room for negotiation. The location and lot size make this a strong flip candidate with potential 20%+ ROI.`;
      } else {
        return `At $${pricePerSqft}/sqft, this property is priced at market rate. Consider the renovation scope carefully - focus on high-impact improvements like kitchen and primary bathroom to maximize ROI in this price range.`;
      }
      
    case 'roi':
      const roi = data.calculation.roiPercentage;
      if (roi >= 20) {
        return `Excellent flip opportunity! This ${roi.toFixed(1)}% ROI exceeds Montgomery County's 18% average. The margin of safety provides good protection against cost overruns. Consider moving quickly on this deal.`;
      } else if (roi >= 15) {
        return `Solid flip potential with ${roi.toFixed(1)}% ROI. This meets minimum profitability thresholds for Montgomery County. Monitor material costs closely and consider value-add opportunities to boost returns.`;
      } else {
        return `Below-target ROI at ${roi.toFixed(1)}%. Consider negotiating purchase price down or finding ways to reduce renovation costs. Alternative: hold as rental if cash flow positive.`;
      }
      
    case 'permit':
      const { status, scopeOfWork } = data.permit;
      if (status === 'approved' || status === 'closed') {
        return `Recent permit work completed successfully: ${scopeOfWork}. This indicates the property has been maintained and updated, potentially reducing your renovation scope and costs.`;
      } else if (status === 'expired') {
        return `Expired permit for ${scopeOfWork}. Verify if work was completed - you may need to address code compliance issues or complete unfinished work in your renovation plan.`;
      } else {
        return `Active permit for ${scopeOfWork}. Monitor progress as this work may affect property availability or reveal additional renovation needs.`;
      }
      
    case 'flip-project':
      const project = data.project;
      if (project.roi && project.roi > 20) {
        return `Outstanding performance! This ${project.roi}% ROI flip completed in ${project.timeline} days demonstrates strong execution. Key success factors: ${project.scopeOfWork.slice(0,2).join(", ")}. Great template for future projects.`;
      } else {
        return `This project provided valuable learning opportunities. Timeline of ${project.timeline} days shows efficient execution. Focus areas for improvement: cost control and scope management for better margins.`;
      }
      
    default:
      return "Analysis not available for this data type.";
  }
};