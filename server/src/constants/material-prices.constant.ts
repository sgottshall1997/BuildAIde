// Comprehensive material price database
export const BASE_MATERIAL_PRICES = [
    // Lumber
    { id: 'lumber-2x4', name: 'Lumber 2x4x8', basePrice: 4.50, unit: 'each', category: 'Lumber' },
    { id: 'lumber-2x6', name: 'Lumber 2x6x8', basePrice: 7.25, unit: 'each', category: 'Lumber' },
    { id: 'lumber-plywood', name: 'Plywood 4x8 3/4"', basePrice: 58.00, unit: 'sheet', category: 'Lumber' },
    { id: 'lumber-osb', name: 'OSB 4x8 7/16"', basePrice: 32.00, unit: 'sheet', category: 'Lumber' },

    // Concrete & Masonry
    { id: 'concrete-ready-mix', name: 'Ready-Mix Concrete', basePrice: 125.00, unit: 'cubic yard', category: 'Concrete' },
    { id: 'concrete-bags', name: 'Concrete Mix 80lb', basePrice: 4.25, unit: 'bag', category: 'Concrete' },
    { id: 'brick-common', name: 'Common Brick', basePrice: 0.85, unit: 'each', category: 'Masonry' },
    { id: 'cement-portland', name: 'Portland Cement 94lb', basePrice: 12.50, unit: 'bag', category: 'Concrete' },

    // Drywall & Insulation
    { id: 'drywall-half-inch', name: 'Drywall 4x8 1/2"', basePrice: 14.50, unit: 'sheet', category: 'Drywall' },
    { id: 'drywall-compound', name: 'Joint Compound 5gal', basePrice: 18.00, unit: 'bucket', category: 'Drywall' },
    { id: 'insulation-fiberglass', name: 'Fiberglass R-13', basePrice: 1.25, unit: 'sq ft', category: 'Insulation' },
    { id: 'insulation-foam', name: 'Spray Foam Kit', basePrice: 485.00, unit: 'kit', category: 'Insulation' },

    // Roofing
    { id: 'shingles-asphalt', name: 'Asphalt Shingles', basePrice: 125.00, unit: 'square', category: 'Roofing' },
    { id: 'roofing-felt', name: 'Roofing Felt 15lb', basePrice: 45.00, unit: 'roll', category: 'Roofing' },
    { id: 'roofing-nails', name: 'Roofing Nails 50lb', basePrice: 78.00, unit: 'box', category: 'Roofing' },

    // Electrical
    { id: 'wire-12-gauge', name: 'Romex 12-2 Wire', basePrice: 1.85, unit: 'linear foot', category: 'Electrical' },
    { id: 'wire-14-gauge', name: 'Romex 14-2 Wire', basePrice: 1.45, unit: 'linear foot', category: 'Electrical' },
    { id: 'electrical-outlet', name: 'GFCI Outlet', basePrice: 18.50, unit: 'each', category: 'Electrical' },
    { id: 'electrical-breaker', name: '20A Circuit Breaker', basePrice: 25.00, unit: 'each', category: 'Electrical' },

    // Plumbing
    { id: 'pipe-pvc-4', name: 'PVC Pipe 4" x10\'', basePrice: 28.00, unit: 'each', category: 'Plumbing' },
    { id: 'pipe-copper-half', name: 'Copper Pipe 1/2"', basePrice: 3.25, unit: 'linear foot', category: 'Plumbing' },
    { id: 'pvc-fittings', name: 'PVC Fittings Kit', basePrice: 45.00, unit: 'kit', category: 'Plumbing' },
    { id: 'toilet-standard', name: 'Standard Toilet', basePrice: 285.00, unit: 'each', category: 'Plumbing' },

    // Flooring
    { id: 'hardwood-oak', name: 'Oak Hardwood Flooring', basePrice: 8.50, unit: 'sq ft', category: 'Flooring' },
    { id: 'laminate-flooring', name: 'Laminate Flooring', basePrice: 3.25, unit: 'sq ft', category: 'Flooring' },
    { id: 'tile-ceramic', name: 'Ceramic Tile 12x12', basePrice: 2.85, unit: 'sq ft', category: 'Flooring' },
    { id: 'carpet-medium', name: 'Carpet Mid-Grade', basePrice: 4.50, unit: 'sq ft', category: 'Flooring' },

    // Paint & Finishes
    { id: 'paint-interior', name: 'Interior Paint Gallon', basePrice: 52.00, unit: 'gallon', category: 'Paint' },
    { id: 'paint-exterior', name: 'Exterior Paint Gallon', basePrice: 68.00, unit: 'gallon', category: 'Paint' },
    { id: 'primer-interior', name: 'Interior Primer', basePrice: 35.00, unit: 'gallon', category: 'Paint' },
    { id: 'stain-wood', name: 'Wood Stain Quart', basePrice: 24.00, unit: 'quart', category: 'Paint' },
];