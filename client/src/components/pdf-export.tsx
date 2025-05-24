import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Loader2 } from "lucide-react";
import jsPDF from 'jspdf';

interface PDFExportProps {
  estimateData: {
    projectType: string;
    area: number;
    materialQuality: string;
    timeline: string;
    description: string;
    estimatedCost: number;
    materialCost?: number;
    laborCost?: number;
    permitCost?: number;
    softCosts?: number;
    materials?: any[];
    laborWorkers?: number;
    laborHours?: number;
    laborRate?: number;
    tradeType?: string;
    siteAccess?: string;
    demolitionRequired?: boolean;
    permitNeeded?: boolean;
  };
  pastProjects?: any[];
  benchmarkData?: any[];
  aiExplanation?: string;
}

export default function PDFExport({ estimateData, pastProjects, benchmarkData, aiExplanation }: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header with company branding
      pdf.setFontSize(24);
      pdf.setTextColor(59, 130, 246); // Blue color
      pdf.text("Spence the Builder", 20, yPosition);
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 116, 139); // Gray color
      pdf.text("Professional Construction Estimate", 20, yPosition + 8);
      
      // Contact info (placeholder)
      pdf.setFontSize(10);
      pdf.text("Maryland Licensed Contractor | (555) 123-4567 | info@shallsconstruction.com", 20, yPosition + 16);
      
      yPosition += 35;

      // Project Summary Section
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Project Summary", 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      const projectDetails = [
        `Project Type: ${estimateData.projectType.charAt(0).toUpperCase() + estimateData.projectType.slice(1)}`,
        `Area: ${estimateData.area.toLocaleString()} sq ft`,
        `Material Quality: ${estimateData.materialQuality.charAt(0).toUpperCase() + estimateData.materialQuality.slice(1)}`,
        `Timeline: ${estimateData.timeline}`,
        `Description: ${estimateData.description || 'Standard construction project'}`
      ];

      projectDetails.forEach(detail => {
        pdf.text(detail, 25, yPosition);
        yPosition += 6;
      });

      yPosition += 10;

      // Cost Breakdown Section
      pdf.setFontSize(16);
      pdf.text("Cost Breakdown", 20, yPosition);
      yPosition += 10;

      // Create a simple table for costs
      const costs = [
        ['Materials', `$${(estimateData.materialCost || 0).toLocaleString()}`],
        ['Labor', `$${(estimateData.laborCost || 0).toLocaleString()}`],
        ['Permits & Fees', `$${(estimateData.permitCost || 0).toLocaleString()}`],
        ['Overhead & Profit', `$${(estimateData.softCosts || 0).toLocaleString()}`],
      ];

      pdf.setFontSize(11);
      costs.forEach(([category, amount]) => {
        pdf.text(category, 25, yPosition);
        pdf.text(amount, 120, yPosition);
        yPosition += 6;
      });

      // Total line
      pdf.line(25, yPosition, 170, yPosition);
      yPosition += 8;
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text("Total Project Cost:", 25, yPosition);
      pdf.text(`$${estimateData.estimatedCost.toLocaleString()}`, 120, yPosition);
      pdf.setFont(undefined, 'normal');
      yPosition += 15;

      // Labor Details (if available)
      if (estimateData.laborWorkers && estimateData.laborHours) {
        pdf.setFontSize(16);
        pdf.text("Labor Details", 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        const laborDetails = [
          `Workers: ${estimateData.laborWorkers}`,
          `Hours per Worker: ${estimateData.laborHours}`,
          `Hourly Rate: $${estimateData.laborRate}/hour`,
          `Trade Type: ${estimateData.tradeType || 'General Labor'}`
        ];

        laborDetails.forEach(detail => {
          pdf.text(detail, 25, yPosition);
          yPosition += 6;
        });
        yPosition += 10;
      }

      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      // AI Analysis Section
      if (aiExplanation) {
        pdf.setFontSize(16);
        pdf.text("Cost Analysis", 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        const lines = pdf.splitTextToSize(aiExplanation, pageWidth - 40);
        pdf.text(lines, 25, yPosition);
        yPosition += lines.length * 5 + 10;
      }

      // Past Projects Comparison (if available)
      if (pastProjects && pastProjects.length > 0) {
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(16);
        pdf.text("Similar Past Projects", 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        pastProjects.slice(0, 3).forEach((project, index) => {
          const costPerSqFt = Math.round(project.finalCost / project.squareFootage);
          pdf.text(`${index + 1}. ${project.address} (${project.year})`, 25, yPosition);
          yPosition += 5;
          pdf.text(`   ${project.squareFootage.toLocaleString()} sq ft - $${project.finalCost.toLocaleString()} ($${costPerSqFt}/sq ft)`, 25, yPosition);
          yPosition += 8;
        });
        yPosition += 10;
      }

      // Footer
      const footerY = pageHeight - 30;
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text("This estimate is valid for 30 days and subject to material availability and site conditions.", 20, footerY);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, footerY + 6);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `Spence_the_Builder_Estimate_${estimateData.projectType}_${timestamp}.pdf`;

      // Save the PDF
      pdf.save(filename);

    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Professional PDF Report
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Generate a professional estimate report with company branding
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-3">PDF Report includes:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Project summary and specifications</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Detailed cost breakdown by category</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Labor details and timeline</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI-powered cost analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Similar past project comparisons</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Professional company branding</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={generatePDF}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating PDF Report...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Professional PDF Report
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 text-center">
            Professional construction proposal format • Client-ready presentation • 30-day validity
          </div>
        </div>
      </CardContent>
    </Card>
  );
}