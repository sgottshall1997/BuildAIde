import { useState } from "react";
import { Button } from "@/components/ui/button";
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

export default function PDFExport({ estimateData }: PDFExportProps) {
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
      
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex items-center gap-2"
      variant="outline"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Export PDF
        </>
      )}
    </Button>
  );
}