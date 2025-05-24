import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
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
  };
}

export default function PDFExport({ estimateData }: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF();
      let yPos = 20;

      // Title
      pdf.setFontSize(20);
      pdf.text("Spence the Builder", 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(14);
      pdf.text("Construction Estimate Report", 20, yPos);
      yPos += 20;

      // Project Info
      pdf.setFontSize(12);
      pdf.text("PROJECT DETAILS", 20, yPos);
      yPos += 8;
      
      pdf.setFontSize(10);
      pdf.text(`Type: ${estimateData.projectType}`, 25, yPos);
      yPos += 6;
      pdf.text(`Area: ${estimateData.area} sq ft`, 25, yPos);
      yPos += 6;
      pdf.text(`Quality: ${estimateData.materialQuality}`, 25, yPos);
      yPos += 6;
      pdf.text(`Timeline: ${estimateData.timeline}`, 25, yPos);
      yPos += 15;

      // Costs
      pdf.setFontSize(12);
      pdf.text("COST BREAKDOWN", 20, yPos);
      yPos += 8;
      
      pdf.setFontSize(10);
      pdf.text(`Materials: $${(estimateData.materialCost || 0).toLocaleString()}`, 25, yPos);
      yPos += 6;
      pdf.text(`Labor: $${(estimateData.laborCost || 0).toLocaleString()}`, 25, yPos);
      yPos += 6;
      pdf.text(`Permits: $${(estimateData.permitCost || 0).toLocaleString()}`, 25, yPos);
      yPos += 6;
      pdf.text(`Overhead: $${(estimateData.softCosts || 0).toLocaleString()}`, 25, yPos);
      yPos += 15;
      
      // Total
      pdf.setFontSize(14);
      pdf.text(`TOTAL: $${estimateData.estimatedCost.toLocaleString()}`, 25, yPos);
      
      // Save
      pdf.save(`Estimate_${Date.now()}.pdf`);
      
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Creating PDF...
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