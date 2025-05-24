import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";
import jsPDF from 'jspdf';

interface SimplePDFExportProps {
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

export default function SimplePDFExport({ estimateData }: SimplePDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = () => {
    setIsGenerating(true);
    
    try {
      // Create new PDF document
      const doc = new jsPDF();
      let y = 20;

      // Header
      doc.setFontSize(20);
      doc.text("Spence the Builder", 20, y);
      y += 10;
      
      doc.setFontSize(12);
      doc.text("Construction Estimate Report", 20, y);
      y += 20;

      // Project Information
      doc.setFontSize(14);
      doc.text("Project Details", 20, y);
      y += 10;

      doc.setFontSize(11);
      doc.text(`Project Type: ${estimateData.projectType}`, 25, y);
      y += 7;
      doc.text(`Area: ${estimateData.area} square feet`, 25, y);
      y += 7;
      doc.text(`Material Quality: ${estimateData.materialQuality}`, 25, y);
      y += 7;
      doc.text(`Timeline: ${estimateData.timeline}`, 25, y);
      y += 7;
      
      if (estimateData.description) {
        doc.text(`Description: ${estimateData.description.substring(0, 80)}`, 25, y);
        y += 7;
      }
      y += 10;

      // Cost Breakdown
      doc.setFontSize(14);
      doc.text("Cost Breakdown", 20, y);
      y += 10;

      doc.setFontSize(11);
      if (estimateData.materialCost && estimateData.materialCost > 0) {
        doc.text(`Materials: $${estimateData.materialCost.toLocaleString()}`, 25, y);
        y += 7;
      }
      
      if (estimateData.laborCost && estimateData.laborCost > 0) {
        doc.text(`Labor: $${estimateData.laborCost.toLocaleString()}`, 25, y);
        y += 7;
      }
      
      if (estimateData.permitCost && estimateData.permitCost > 0) {
        doc.text(`Permits: $${estimateData.permitCost.toLocaleString()}`, 25, y);
        y += 7;
      }
      
      if (estimateData.softCosts && estimateData.softCosts > 0) {
        doc.text(`Overhead & Profit: $${estimateData.softCosts.toLocaleString()}`, 25, y);
        y += 7;
      }

      // Total
      y += 10;
      doc.setFontSize(14);
      doc.text(`TOTAL ESTIMATE: $${estimateData.estimatedCost.toLocaleString()}`, 25, y);

      // Footer
      y += 30;
      doc.setFontSize(9);
      doc.text("This estimate is valid for 30 days and subject to change.", 20, y);
      y += 5;
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, y);

      // Save with clean filename
      const date = new Date().toISOString().slice(0, 10);
      const projectName = estimateData.projectType.replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`${projectName}_Estimate_${date}.pdf`);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex items-center gap-2"
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