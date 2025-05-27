import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AIBidEnhancer from '@/components/ai-bid-enhancer';
import { FileText, Calendar, DollarSign, Clock, Users } from 'lucide-react';

interface EnhancedBidPreviewProps {
  estimateData: any;
  className?: string;
}

export default function EnhancedBidPreview({ estimateData, className }: EnhancedBidPreviewProps) {
  const [sections, setSections] = useState({
    projectOverview: `We will complete your ${estimateData.projectType?.toLowerCase() || 'construction project'} with professional craftsmanship and attention to detail. This ${estimateData.squareFootage || 0} square foot project will be completed using ${estimateData.materialQuality?.toLowerCase() || 'standard'} quality materials within the ${estimateData.timeline?.toLowerCase() || 'standard'} timeframe.`,
    
    scopeOfWork: `Our team will handle all aspects of the project including material procurement, installation, cleanup, and final inspection. We will coordinate with local inspectors to ensure all work meets current building codes. Project includes all necessary permits and fees.`,
    
    timeline: `Project is scheduled to begin on the agreed start date and will be completed within ${estimateData.timeline?.toLowerCase() || 'the standard timeframe'}. Weather delays and change orders may affect the completion date. We will provide weekly progress updates throughout the project.`,
    
    terms: `Payment is due in installments: 25% deposit to begin work, 50% at project midpoint, and 25% upon completion. All materials are warranted for one year. Labor warranty is provided for two years from project completion.`
  });

  const handleSectionUpdate = (sectionKey: string, newText: string) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: newText
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalCost = estimateData.estimatedCost || 0;
  const materialCost = Math.round(totalCost * 0.35);
  const laborCost = Math.round(totalCost * 0.30);
  const permitCost = Math.round(totalCost * 0.05);
  const overhead = Math.round(totalCost * 0.30);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <FileText className="w-5 h-5" />
            Professional Bid Preview
          </CardTitle>
          <p className="text-blue-700 text-sm">
            Each section can be enhanced with AI-powered professional language
          </p>
        </CardHeader>
      </Card>

      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Project Proposal</CardTitle>
              <p className="text-slate-600 mt-1">{estimateData.projectType} - {estimateData.squareFootage} sq ft</p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Ready for Client
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Cost Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(materialCost)}</div>
              <div className="text-sm text-slate-600">Materials</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(laborCost)}</div>
              <div className="text-sm text-slate-600">Labor</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(permitCost)}</div>
              <div className="text-sm text-slate-600">Permits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{formatCurrency(totalCost)}</div>
              <div className="text-sm text-slate-600">Total</div>
            </div>
          </div>

          <Separator />

          {/* Project Overview Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Project Overview</h3>
              <AIBidEnhancer
                originalText={sections.projectOverview}
                section="Project Overview"
                onTextImproved={(newText) => handleSectionUpdate('projectOverview', newText)}
              />
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border">
              <p className="text-slate-700 leading-relaxed">{sections.projectOverview}</p>
            </div>
          </div>

          <Separator />

          {/* Scope of Work Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Scope of Work</h3>
              <AIBidEnhancer
                originalText={sections.scopeOfWork}
                section="Scope of Work"
                onTextImproved={(newText) => handleSectionUpdate('scopeOfWork', newText)}
              />
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border">
              <p className="text-slate-700 leading-relaxed">{sections.scopeOfWork}</p>
            </div>
          </div>

          <Separator />

          {/* Timeline & Schedule Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Timeline & Schedule
              </h3>
              <AIBidEnhancer
                originalText={sections.timeline}
                section="Timeline & Schedule"
                onTextImproved={(newText) => handleSectionUpdate('timeline', newText)}
              />
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border">
              <p className="text-slate-700 leading-relaxed">{sections.timeline}</p>
            </div>
          </div>

          <Separator />

          {/* Terms & Conditions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Terms & Conditions</h3>
              <AIBidEnhancer
                originalText={sections.terms}
                section="Terms & Conditions"
                onTextImproved={(newText) => handleSectionUpdate('terms', newText)}
              />
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border">
              <p className="text-slate-700 leading-relaxed">{sections.terms}</p>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-800">Shall's Construction</p>
                <p className="text-blue-700">Licensed & Insured</p>
                <p className="text-blue-700">License #: CON-2024-001</p>
              </div>
              <div>
                <p className="text-blue-700">Phone: (555) 123-4567</p>
                <p className="text-blue-700">Email: info@shallsconstruction.com</p>
                <p className="text-blue-700">www.shallsconstruction.com</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              Send to Client
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Share with Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}