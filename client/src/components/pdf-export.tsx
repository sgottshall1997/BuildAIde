import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import jsPDF from 'jspdf';
import { toast } from "@/hooks/use-toast";

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
      const doc = new jsPDF();
      let y = 20;

      // Header
      doc.setFontSize(20);
      doc.text("Spence the Builder", 20, y);
      y += 10;

      doc.setFontSize(12);
      doc.text("Construction Estimate Report", 20, y);
      y += 20;

      // Project Details
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
      y += 15;

      // Cost Breakdown
      doc.setFontSize(14);
      doc.text("Cost Breakdown", 20, y);
      y += 10;

      doc.setFontSize(11);
      if (estimateData.materialCost) {
        doc.text(`Materials: $${estimateData.materialCost.toLocaleString()}`, 25, y);
        y += 7;
      }

      if (estimateData.laborCost) {
        doc.text(`Labor: $${estimateData.laborCost.toLocaleString()}`, 25, y);
        y += 7;
      }

      if (estimateData.permitCost) {
        doc.text(`Permits: $${estimateData.permitCost.toLocaleString()}`, 25, y);
        y += 7;
      }

      if (estimateData.softCosts) {
        doc.text(`Overhead & Profit: $${estimateData.softCosts.toLocaleString()}`, 25, y);
        y += 7;
      }

      // Total
      y += 10;
      doc.setFontSize(14);
      doc.text(`TOTAL ESTIMATE: $${estimateData.estimatedCost.toLocaleString()}`, 25, y);

      // Footer
      y = doc.internal.pageSize.height - 20;
      doc.setFontSize(9);
      doc.text("This estimate is valid for 30 days and subject to change.", 20, y);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, y + 5);

      // Save with clean filename
      const date = new Date().toISOString().slice(0, 10);
      const projectName = estimateData.projectType.replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`${projectName}_Estimate_${date}.pdf`);

      toast({
        title: "Success",
        description: "PDF generated successfully",
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
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