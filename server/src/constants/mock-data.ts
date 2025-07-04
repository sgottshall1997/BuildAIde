// Mock data for house flipping tools - Kensington, MD focused
// Replace with real API integrations when available

export const mockListings = [
    {
        id: "1",
        address: "4715 Kent St, Kensington, MD 20895",
        price: 610000,
        sqft: 2150,
        bedrooms: 4,
        bathrooms: 2.5,
        daysOnMarket: 19,
        status: "active",
        zipCode: "20895",
        description: "Classic brick rambler with finished basement and original hardwood floors. Minor kitchen updates needed. New roof in 2022.",
        listingUrl: "https://example.com/listing1",
        photos: []
    },
    {
        id: "2",
        address: "8925 Flower Ave, Silver Spring, MD 20901",
        price: 475000,
        sqft: 1850,
        bedrooms: 3,
        bathrooms: 2,
        daysOnMarket: 35,
        status: "active",
        zipCode: "20901",
        description: "Split-level home with large lot. Needs kitchen renovation and flooring updates. Great bones in established neighborhood.",
        listingUrl: "https://example.com/listing2",
        photos: []
    },
    {
        id: "3",
        address: "12406 Georgia Ave, Wheaton, MD 20902",
        price: 395000,
        sqft: 1650,
        bedrooms: 3,
        bathrooms: 1.5,
        daysOnMarket: 58,
        status: "active",
        zipCode: "20902",
        description: "Townhouse with 2-car garage. Needs full interior renovation including electrical and plumbing updates. Priced below market.",
        listingUrl: "https://example.com/listing3",
        photos: []
    },
    {
        id: "4",
        address: "2104 Lakeforest Dr, Reston, VA 20191",
        price: 685000,
        sqft: 2400,
        bedrooms: 4,
        bathrooms: 3,
        daysOnMarket: 12,
        status: "active",
        zipCode: "20191",
        description: "Contemporary colonial in Lake Anne area. Recently updated but overpriced for current market conditions.",
        listingUrl: "https://example.com/listing4",
        photos: []
    }
];

export const mockPermits = [
    {
        id: "1",
        permitNumber: "P24-001234",
        address: "2847 Maple Ridge Ln, Rockville, MD 20852",
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
        address: "1563 Oakwood Dr, Bethesda, MD 20814",
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
        address: "9432 Cedar Grove Ct, Silver Spring, MD 20910",
        status: "expired",
        scopeOfWork: "HVAC system replacement",
        issueDate: "2023-09-10",
        inspectionDate: "2023-10-15",
        permitType: "Mechanical",
        contractorName: "Cool Air HVAC",
        estimatedValue: 12000
    }
];

export const mockScheduledProjects = [
    {
        id: "1",
        projectName: "Columbia Kitchen Remodel",
        propertyAddress: "456 Summit Ave, Kensington, MD 20895",
        startDate: "2024-05-01",
        estimatedDuration: 45,
        crewMembers: 4,
        estimatedBudget: 75000,
        projectedProfit: 18000,
        status: "in-progress",
        notes: "Client wants premium finishes, timeline is flexible",
        createdAt: "2024-04-15T10:00:00.000Z",
        projectedEndDate: "2024-06-15",
        profitMargin: 24.0
    },
    {
        id: "2",
        projectName: "Bethesda Bathroom Renovation",
        propertyAddress: "789 Park Ave, Bethesda, MD 20814",
        startDate: "2024-05-15",
        estimatedDuration: 28,
        crewMembers: 3,
        estimatedBudget: 42000,
        projectedProfit: 8400,
        status: "not-started",
        notes: "Permit approval pending, materials ordered",
        createdAt: "2024-04-20T14:30:00.000Z",
        projectedEndDate: "2024-06-12",
        profitMargin: 20.0
    },
    {
        id: "3",
        projectName: "Rockville Deck Construction",
        propertyAddress: "321 Oak Street, Rockville, MD 20852",
        startDate: "2024-04-20",
        estimatedDuration: 21,
        crewMembers: 2,
        estimatedBudget: 28000,
        projectedProfit: 6300,
        status: "delayed",
        notes: "Weather delays, material delivery issues",
        createdAt: "2024-04-01T09:15:00.000Z",
        projectedEndDate: "2024-05-11",
        profitMargin: 22.5
    }
];

export const mockFlipProjects = [];

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
                return `Outstanding performance! This ${project.roi}% ROI flip completed in ${project.timeline} days demonstrates strong execution. Key success factors: ${project.scopeOfWork.slice(0, 2).join(", ")}. Great template for future projects.`;
            } else {
                return `This project provided valuable learning opportunities. Timeline of ${project.timeline} days shows efficient execution. Focus areas for improvement: cost control and scope management for better margins.`;
            }

        default:
            return "Analysis not available for this data type.";
    }
};