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
      let yPosition = 20;

      // Header
      pdf.setFontSize(20);
      pdf.text("Spence the Builder", 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(14);
      pdf.text("Construction Estimate Report", 20, yPosition);
      yPosition += 20;

      // Project Details
      pdf.setFontSize(12);
      pdf.text("PROJECT DETAILS:", 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.text(`Project Type: ${estimateData.projectType}`, 25, yPosition);
      yPosition += 6;
      pdf.text(`Area: ${estimateData.area} sq ft`, 25, yPosition);
      yPosition += 6;
      pdf.text(`Material Quality: ${estimateData.materialQuality}`, 25, yPosition);
      yPosition += 6;
      pdf.text(`Timeline: ${estimateData.timeline}`, 25, yPosition);
      yPosition += 15;

      // Cost Breakdown
      pdf.setFontSize(12);
      pdf.text("COST BREAKDOWN:", 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      const materialCost = estimateData.materialCost || 0;
      const laborCost = estimateData.laborCost || 0;
      const permitCost = estimateData.permitCost || 0;
      const softCosts = estimateData.softCosts || 0;
      
      pdf.text(`Materials: $${materialCost.toLocaleString()}`, 25, yPosition);
      yPosition += 6;
      pdf.text(`Labor: $${laborCost.toLocaleString()}`, 25, yPosition);
      yPosition += 6;
      pdf.text(`Permits & Fees: $${permitCost.toLocaleString()}`, 25, yPosition);
      yPosition += 6;
      pdf.text(`Overhead & Profit: $${softCosts.toLocaleString()}`, 25, yPosition);
      yPosition += 15;
      
      // Total
      pdf.setFontSize(14);
      pdf.text(`TOTAL ESTIMATE: $${estimateData.estimatedCost.toLocaleString()}`, 25, yPosition);
      yPosition += 20;
      
      // Footer
      pdf.setFontSize(8);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 25, yPosition);
      
      // Save PDF
      const fileName = `SpenceTheBuilder_Estimate_${Date.now()}.pdf`;
      pdf.save(fileName);
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

      // Ensure content is finalized
      pdf.setProperties({
        title: `Estimate - ${estimateData.projectType}`,
        subject: 'Construction Estimate',
        author: 'Spence the Builder',
        creator: 'Spence the Builder Smart Tools'
      });

      // Generate clean filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const projectTypeClean = estimateData.projectType.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Estimate_${projectTypeClean}_${timestamp}.pdf`;

      // Save the PDF with proper error handling
      try {
        pdf.save(filename);
        
        // Small delay to ensure save completes
        setTimeout(() => {
          console.log("PDF generated successfully:", filename);
        }, 500);
      } catch (saveError) {
        console.error("Error saving PDF:", saveError);
        throw new Error("Failed to save PDF file");
      }

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
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