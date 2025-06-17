import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Calculator } from "lucide-react";

interface DetailedCostBreakdownProps {
  projectType: string;
  materialCost: number;
  laborCost: number;
  permitCost: number;
  totalCost: number;
  area: number;
  materialQuality: string;
}

interface CostItem {
  name: string;
  cost: number;
  unit: string;
  quantity: number;
  description?: string;
}

export default function DetailedCostBreakdown({ 
  projectType, 
  materialCost, 
  laborCost, 
  permitCost, 
  totalCost,
  area,
  materialQuality 
}: DetailedCostBreakdownProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getDetailedBreakdown = () => {
    const isKitchen = projectType.toLowerCase().includes('kitchen');
    const isBathroom = projectType.toLowerCase().includes('bathroom');
    const isBasement = projectType.toLowerCase().includes('basement');
    const isAddition = projectType.toLowerCase().includes('addition');

    const qualityMultiplier = {
      'budget': 0.8,
      'standard': 1.0,
      'mid-range': 1.2,
      'premium': 1.5,
      'luxury': 2.0
    }[materialQuality?.toLowerCase()] || 1.0;

    let materialItems: CostItem[] = [];
    let laborItems: CostItem[] = [];

    if (isKitchen) {
      materialItems = [
        { name: "Cabinets", cost: Math.round(materialCost * 0.35 * qualityMultiplier), unit: "linear feet", quantity: 20, description: "Base and wall cabinets" },
        { name: "Countertops", cost: Math.round(materialCost * 0.25 * qualityMultiplier), unit: "sq ft", quantity: Math.round(area * 0.1), description: materialQuality === 'luxury' ? "Marble/Quartz" : materialQuality === 'premium' ? "Granite" : "Laminate/Quartz" },
        { name: "Appliances", cost: Math.round(materialCost * 0.20 * qualityMultiplier), unit: "package", quantity: 1, description: "Range, refrigerator, dishwasher" },
        { name: "Sink & Faucet", cost: Math.round(materialCost * 0.08 * qualityMultiplier), unit: "set", quantity: 1, description: materialQuality === 'luxury' ? "Farmhouse sink with premium faucet" : "Standard undermount" },
        { name: "Flooring", cost: Math.round(materialCost * 0.12 * qualityMultiplier), unit: "sq ft", quantity: area, description: materialQuality === 'luxury' ? "Hardwood/Stone" : "Tile/Vinyl" }
      ];

      laborItems = [
        { name: "Cabinet Installation", cost: Math.round(laborCost * 0.30), unit: "hours", quantity: 16, description: "Professional cabinet mounting" },
        { name: "Countertop Installation", cost: Math.round(laborCost * 0.20), unit: "hours", quantity: 8, description: "Template, cut, install" },
        { name: "Plumbing Work", cost: Math.round(laborCost * 0.25), unit: "hours", quantity: 12, description: "Sink, dishwasher, disposal connections" },
        { name: "Electrical Work", cost: Math.round(laborCost * 0.15), unit: "hours", quantity: 8, description: "Appliance circuits, under-cabinet lighting" },
        { name: "Flooring Installation", cost: Math.round(laborCost * 0.10), unit: "hours", quantity: 6, description: "Prep and install flooring" }
      ];
    } else if (isBathroom) {
      materialItems = [
        { name: "Vanity & Cabinet", cost: Math.round(materialCost * 0.25 * qualityMultiplier), unit: "piece", quantity: 1, description: "Bathroom vanity with storage" },
        { name: "Tile & Stone", cost: Math.round(materialCost * 0.30 * qualityMultiplier), unit: "sq ft", quantity: Math.round(area * 1.5), description: "Floor and wall tile" },
        { name: "Toilet", cost: Math.round(materialCost * 0.10 * qualityMultiplier), unit: "piece", quantity: 1, description: materialQuality === 'luxury' ? "Smart toilet" : "Standard toilet" },
        { name: "Shower/Tub", cost: Math.round(materialCost * 0.20 * qualityMultiplier), unit: "piece", quantity: 1, description: materialQuality === 'luxury' ? "Walk-in shower with glass" : "Standard tub/shower" },
        { name: "Faucets & Fixtures", cost: Math.round(materialCost * 0.15 * qualityMultiplier), unit: "set", quantity: 1, description: "Sink faucet, shower fixtures, accessories" }
      ];

      laborItems = [
        { name: "Plumbing Installation", cost: Math.round(laborCost * 0.40), unit: "hours", quantity: 16, description: "Rough-in and fixture installation" },
        { name: "Tile Installation", cost: Math.round(laborCost * 0.30), unit: "hours", quantity: 20, description: "Floor and wall tile work" },
        { name: "Electrical Work", cost: Math.round(laborCost * 0.15), unit: "hours", quantity: 8, description: "Lighting, ventilation, GFCI outlets" },
        { name: "Vanity Installation", cost: Math.round(laborCost * 0.15), unit: "hours", quantity: 6, description: "Mount vanity, connect plumbing" }
      ];
    } else {
      // General construction breakdown
      materialItems = [
        { name: "Lumber & Framing", cost: Math.round(materialCost * 0.25), unit: "board feet", quantity: 500, description: "Structural lumber and framing materials" },
        { name: "Drywall & Insulation", cost: Math.round(materialCost * 0.20), unit: "sq ft", quantity: area * 2, description: "Drywall sheets, mud, tape, insulation" },
        { name: "Flooring Materials", cost: Math.round(materialCost * 0.20), unit: "sq ft", quantity: area, description: "Flooring and underlayment" },
        { name: "Paint & Finishes", cost: Math.round(materialCost * 0.15), unit: "gallons", quantity: 10, description: "Primer, paint, trim materials" },
        { name: "Hardware & Fasteners", cost: Math.round(materialCost * 0.10), unit: "misc", quantity: 1, description: "Nails, screws, brackets" },
        { name: "Electrical Materials", cost: Math.round(materialCost * 0.10), unit: "misc", quantity: 1, description: "Wire, outlets, switches, fixtures" }
      ];

      laborItems = [
        { name: "Framing & Structural", cost: Math.round(laborCost * 0.30), unit: "hours", quantity: 24, description: "Rough framing and structural work" },
        { name: "Drywall Installation", cost: Math.round(laborCost * 0.25), unit: "hours", quantity: 16, description: "Hang, mud, sand, prime" },
        { name: "Finish Carpentry", cost: Math.round(laborCost * 0.20), unit: "hours", quantity: 12, description: "Trim, doors, baseboards" },
        { name: "Painting", cost: Math.round(laborCost * 0.15), unit: "hours", quantity: 10, description: "Prime and paint all surfaces" },
        { name: "Final Installation", cost: Math.round(laborCost * 0.10), unit: "hours", quantity: 8, description: "Hardware, fixtures, cleanup" }
      ];
    }

    return { materialItems, laborItems };
  };

  const { materialItems, laborItems } = getDetailedBreakdown();
  const otherCosts = totalCost - materialCost - laborCost - permitCost;

  const sections = [
    {
      id: 'materials',
      title: 'Materials',
      total: materialCost,
      items: materialItems,
      color: 'blue'
    },
    {
      id: 'labor',
      title: 'Labor',
      total: laborCost,
      items: laborItems,
      color: 'green'
    },
    {
      id: 'permits',
      title: 'Permits & Fees',
      total: permitCost,
      items: [
        { name: "Building Permit", cost: Math.round(permitCost * 0.60), unit: "permit", quantity: 1, description: "Main construction permit" },
        { name: "Electrical Permit", cost: Math.round(permitCost * 0.25), unit: "permit", quantity: 1, description: "Electrical work permit" },
        { name: "Plumbing Permit", cost: Math.round(permitCost * 0.15), unit: "permit", quantity: 1, description: "Plumbing work permit" }
      ],
      color: 'orange'
    },
    {
      id: 'other',
      title: 'Equipment & Overhead',
      total: otherCosts,
      items: [
        { name: "Tool Rental", cost: Math.round(otherCosts * 0.30), unit: "days", quantity: 10, description: "Equipment and tool rental" },
        { name: "Waste Disposal", cost: Math.round(otherCosts * 0.20), unit: "loads", quantity: 3, description: "Dumpster and disposal fees" },
        { name: "Project Management", cost: Math.round(otherCosts * 0.25), unit: "hours", quantity: 20, description: "Supervision and coordination" },
        { name: "Insurance & Overhead", cost: Math.round(otherCosts * 0.25), unit: "project", quantity: 1, description: "Insurance, overhead, profit margin" }
      ],
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-600 dark:text-blue-400' },
      green: { bg: 'bg-green-50 dark:bg-green-950/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-600 dark:text-green-400' },
      orange: { bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-600 dark:text-orange-400' },
      purple: { bg: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-600 dark:text-purple-400' }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Detailed Cost Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const colorClasses = getColorClasses(section.color);

          return (
            <div key={section.id} className={`rounded-lg border ${colorClasses.border} ${colorClasses.bg}`}>
              <Button
                variant="ghost"
                onClick={() => toggleSection(section.id)}
                className="w-full justify-between p-4 h-auto hover:bg-transparent"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">{section.title}</span>
                </div>
                <span className={`font-bold text-lg ${colorClasses.text}`}>
                  ${section.total.toLocaleString()}
                </span>
              </Button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {section.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start py-2 border-t border-gray-200 dark:border-gray-700 first:border-t-0">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{item.name}</span>
                          <span className="font-semibold">${item.cost.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {item.quantity} {item.unit} • {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-2 mt-3 border-t-2 border-gray-300 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Subtotal</span>
                      <span className={`font-bold text-lg ${colorClasses.text}`}>
                        ${section.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Project Total</span>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${totalCost.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}