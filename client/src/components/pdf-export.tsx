import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PDFExportProps {
  elementId: string;
  filename: string;
  title: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export default function PDFExport({ 
  elementId, 
  filename, 
  title, 
  className = "",
  variant = "outline",
  size = "default"
}: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error("Element not found");
      }

      // Create canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      // Calculate PDF dimensions
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add header
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Shall's Construction Smart Tools", 20, 20);
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(title, 20, 30);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 38);
      
      // Add line separator
      pdf.setLineWidth(0.5);
      pdf.line(20, 42, pdfWidth - 20, 42);
      
      // Add the captured content
      if (pdfHeight <= pdf.internal.pageSize.getHeight() - 50) {
        // Single page
        pdf.addImage(imgData, "PNG", 20, 50, pdfWidth - 40, pdfHeight - 20);
      } else {
        // Multiple pages
        let position = 50;
        const pageHeight = pdf.internal.pageSize.getHeight() - 50;
        
        while (position < pdfHeight) {
          const remainingHeight = Math.min(pageHeight, pdfHeight - position);
          pdf.addImage(imgData, "PNG", 20, 50, pdfWidth - 40, remainingHeight);
          
          if (position + pageHeight < pdfHeight) {
            pdf.addPage();
            position += pageHeight;
          } else {
            break;
          }
        }
      }
      
      // Save the PDF
      pdf.save(`${filename}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={exportToPDF}
      disabled={isExporting}
      variant={variant}
      size={size}
      className={className}
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </>
      )}
    </Button>
  );
}

// Specialized export for flip opinions
export function FlipOpinionPDFExport({ 
  propertyAddress, 
  elementId 
}: { 
  propertyAddress: string; 
  elementId: string; 
}) {
  const cleanAddress = propertyAddress.replace(/[^a-zA-Z0-9]/g, "-");
  const filename = `${cleanAddress}-Flip-Analysis`;
  
  return (
    <PDFExport
      elementId={elementId}
      filename={filename}
      title={`Flip Analysis: ${propertyAddress}`}
      variant="outline"
      size="sm"
      className="ml-2"
    />
  );
}

// Specialized export for project schedules
export function ProjectSchedulePDFExport({ 
  projectName, 
  elementId 
}: { 
  projectName: string; 
  elementId: string; 
}) {
  const cleanName = projectName.replace(/[^a-zA-Z0-9]/g, "-");
  const filename = `${cleanName}-Project-Schedule`;
  
  return (
    <PDFExport
      elementId={elementId}
      filename={filename}
      title={`Project Schedule: ${projectName}`}
      variant="default"
      size="default"
      className="mb-4"
    />
  );
}