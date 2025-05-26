import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  Download, 
  FileText, 
  Printer, 
  Share2,
  CheckCircle,
  ExternalLink 
} from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportData {
  title: string;
  data: any;
  type: 'estimate' | 'analysis' | 'calculation' | 'report' | 'comparison';
  timestamp?: Date;
  projectDetails?: Record<string, any>;
}

interface ExportToolsProps {
  data: ExportData;
  elementId?: string; // ID of the element to export as PDF
  className?: string;
  showTitle?: boolean;
}

export function ExportTools({ 
  data, 
  elementId,
  className = "",
  showTitle = true 
}: ExportToolsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const { toast } = useToast();

  const formatDataForCopy = (exportData: ExportData): string => {
    const timestamp = exportData.timestamp || new Date();
    const lines = [
      `${exportData.title}`,
      `Generated: ${timestamp.toLocaleDateString()} at ${timestamp.toLocaleTimeString()}`,
      `\n${'='.repeat(50)}\n`
    ];

    // Add project details if available
    if (exportData.projectDetails) {
      lines.push('PROJECT DETAILS:');
      Object.entries(exportData.projectDetails).forEach(([key, value]) => {
        lines.push(`${key}: ${value}`);
      });
      lines.push('\n');
    }

    // Format based on data type
    switch (exportData.type) {
      case 'estimate':
        if (exportData.data.totalCost) {
          lines.push(`COST ESTIMATE:`);
          lines.push(`Total Cost: $${exportData.data.totalCost.toLocaleString()}`);
          
          if (exportData.data.costRange) {
            lines.push(`Range: $${exportData.data.costRange.low.toLocaleString()} - $${exportData.data.costRange.high.toLocaleString()}`);
          }
          
          if (exportData.data.breakdown) {
            lines.push('\nCOST BREAKDOWN:');
            Object.entries(exportData.data.breakdown).forEach(([key, value]: [string, any]) => {
              lines.push(`${key.charAt(0).toUpperCase() + key.slice(1)}: $${value.toLocaleString()}`);
            });
          }
          
          if (exportData.data.recommendations) {
            lines.push('\nRECOMMENDATIONS:');
            exportData.data.recommendations.forEach((rec: string, index: number) => {
              lines.push(`${index + 1}. ${rec}`);
            });
          }
        } else if (exportData.data.lowEnd && exportData.data.highEnd) {
          lines.push(`COST ESTIMATE:`);
          lines.push(`Range: $${exportData.data.lowEnd.toLocaleString()} - $${exportData.data.highEnd.toLocaleString()}`);
          lines.push(`Per Sq Ft: $${exportData.data.perSqFt}`);
          
          if (exportData.data.keyFactors) {
            lines.push('\nKEY FACTORS:');
            exportData.data.keyFactors.forEach((factor: string, index: number) => {
              lines.push(`• ${factor}`);
            });
          }
        }
        break;

      case 'calculation':
        if (exportData.data.roiPercentage !== undefined) {
          lines.push(`ROI CALCULATION:`);
          lines.push(`Purchase Price: $${exportData.data.purchasePrice?.toLocaleString() || 'N/A'}`);
          lines.push(`Rehab Budget: $${exportData.data.rehabBudget?.toLocaleString() || 'N/A'}`);
          lines.push(`After Repair Value: $${exportData.data.afterRepairValue?.toLocaleString() || 'N/A'}`);
          lines.push(`Total Investment: $${exportData.data.totalInvestment?.toLocaleString() || 'N/A'}`);
          lines.push(`Estimated Profit: $${exportData.data.estimatedProfit?.toLocaleString() || 'N/A'}`);
          lines.push(`ROI Percentage: ${exportData.data.roiPercentage?.toFixed(2)}%`);
          lines.push(`Margin of Safety: ${exportData.data.marginOfSafety?.toFixed(2)}%`);
        }
        break;

      case 'comparison':
        if (Array.isArray(exportData.data)) {
          lines.push(`QUOTE COMPARISON:`);
          exportData.data.forEach((quote: any, index: number) => {
            lines.push(`\nQuote ${index + 1}: ${quote.contractor}`);
            lines.push(`Cost: $${quote.totalCost?.toLocaleString()}`);
            lines.push(`Timeline: ${quote.timeline || 'Not specified'}`);
            
            if (quote.strengths && quote.strengths.length > 0) {
              lines.push(`Strengths: ${quote.strengths.join(', ')}`);
            }
            
            if (quote.redFlags && quote.redFlags.length > 0) {
              lines.push(`Concerns: ${quote.redFlags.join(', ')}`);
            }
            
            if (quote.recommendation) {
              lines.push(`Recommendation: ${quote.recommendation}`);
            }
          });
        }
        break;

      case 'analysis':
      case 'report':
      default:
        if (typeof exportData.data === 'string') {
          lines.push('ANALYSIS:');
          lines.push(exportData.data);
        } else {
          lines.push('DATA:');
          lines.push(JSON.stringify(exportData.data, null, 2));
        }
        break;
    }

    lines.push(`\n${'='.repeat(50)}`);
    lines.push(`Generated by ConstructionSmartTools`);
    lines.push(`${window.location.origin}`);

    return lines.join('\n');
  };

  const copyToClipboard = async () => {
    setIsCopying(true);
    try {
      const textToCopy = formatDataForCopy(data);
      await navigator.clipboard.writeText(textToCopy);
      
      toast({
        title: "Copied to Clipboard!",
        description: "Your results have been copied and are ready to paste anywhere.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = margin;

      // Add title
      pdf.setFontSize(18);
      pdf.setFont(undefined, 'bold');
      pdf.text(data.title, margin, yPosition);
      yPosition += 15;

      // Add timestamp
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      const timestamp = data.timestamp || new Date();
      pdf.text(`Generated: ${timestamp.toLocaleDateString()} at ${timestamp.toLocaleTimeString()}`, margin, yPosition);
      yPosition += 20;

      // If elementId is provided, capture that element
      if (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - (margin * 2);
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Check if image fits on page, if not scale it down
          const maxHeight = pdf.internal.pageSize.getHeight() - yPosition - margin;
          const finalHeight = Math.min(imgHeight, maxHeight);
          const finalWidth = imgWidth; // Keep original width calculation
          
          pdf.addImage(imgData, 'PNG', margin, yPosition, finalWidth, finalHeight);
        }
      } else {
        // Add formatted text content
        pdf.setFontSize(12);
        const textContent = formatDataForCopy(data);
        const lines = pdf.splitTextToSize(textContent, pageWidth - (margin * 2));
        
        lines.forEach((line: string) => {
          if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 7;
        });
      }

      // Save the PDF
      const filename = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`;
      pdf.save(filename);
      
      toast({
        title: "PDF Downloaded!",
        description: "Your results have been saved as a PDF file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsCSV = () => {
    try {
      let csvContent = '';
      
      // Add headers
      csvContent += `"Title","${data.title}"\n`;
      csvContent += `"Generated","${(data.timestamp || new Date()).toLocaleString()}"\n`;
      csvContent += '\n';

      // Add project details if available
      if (data.projectDetails) {
        csvContent += '"Project Details"\n';
        Object.entries(data.projectDetails).forEach(([key, value]) => {
          csvContent += `"${key}","${value}"\n`;
        });
        csvContent += '\n';
      }

      // Format data based on type
      if (data.type === 'estimate' && data.data.breakdown) {
        csvContent += '"Cost Breakdown"\n';
        csvContent += '"Category","Amount"\n';
        Object.entries(data.data.breakdown).forEach(([key, value]: [string, any]) => {
          csvContent += `"${key}","${value}"\n`;
        });
      } else if (data.type === 'comparison' && Array.isArray(data.data)) {
        csvContent += '"Quote Comparison"\n';
        csvContent += '"Contractor","Total Cost","Timeline","Price Reasonableness"\n';
        data.data.forEach((quote: any) => {
          csvContent += `"${quote.contractor}","${quote.totalCost}","${quote.timeline || 'N/A'}","${quote.priceReasonableness || 'N/A'}"\n`;
        });
      } else {
        csvContent += '"Data"\n';
        csvContent += `"${typeof data.data === 'string' ? data.data.replace(/"/g, '""') : JSON.stringify(data.data)}"\n`;
      }

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "CSV Downloaded!",
        description: "Your results have been saved as a CSV file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to generate CSV. Please try again.",
        variant: "destructive",
      });
    }
  };

  const printResults = () => {
    try {
      const printContent = formatDataForCopy(data);
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${data.title}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  line-height: 1.6; 
                  margin: 20px; 
                  color: #333;
                }
                h1 { color: #2563eb; margin-bottom: 20px; }
                pre { 
                  white-space: pre-wrap; 
                  font-family: inherit;
                  background: #f8f9fa;
                  padding: 15px;
                  border-radius: 8px;
                  border-left: 4px solid #2563eb;
                }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <h1>${data.title}</h1>
              <pre>${printContent}</pre>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    } catch (error) {
      toast({
        title: "Print Failed",
        description: "Unable to open print dialog. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`border-slate-200 bg-slate-50 ${className}`}>
      <CardContent className="p-4">
        {showTitle && (
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="h-4 w-4 text-slate-600" />
            <h3 className="font-medium text-slate-900">Export & Share</h3>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            disabled={isCopying}
            className="flex items-center gap-2"
          >
            {isCopying ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {isCopying ? 'Copied!' : 'Copy'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportAsPDF}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {isExporting ? 'Saving...' : 'PDF'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportAsCSV}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={printResults}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
        
        <p className="text-xs text-slate-500 mt-3 text-center">
          Save, share, or print your results for easy reference
        </p>
      </CardContent>
    </Card>
  );
}

// Quick copy button for smaller spaces
interface QuickCopyProps {
  data: ExportData;
  variant?: 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default';
}

export function QuickCopyButton({ data, variant = 'outline', size = 'sm' }: QuickCopyProps) {
  const [isCopying, setIsCopying] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      const exportTools = { formatDataForCopy };
      const textToCopy = exportTools.formatDataForCopy(data);
      await navigator.clipboard.writeText(textToCopy);
      
      toast({
        title: "Copied!",
        description: "Results copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      disabled={isCopying}
      className="flex items-center gap-1"
    >
      {isCopying ? (
        <CheckCircle className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {isCopying ? 'Copied!' : 'Copy'}
    </Button>
  );
}

// Inline export actions for result sections
interface InlineExportProps {
  data: ExportData;
  elementId?: string;
  className?: string;
}

export function InlineExportActions({ data, elementId, className = "" }: InlineExportProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <QuickCopyButton data={data} />
      <ExportTools 
        data={data} 
        elementId={elementId}
        showTitle={false}
        className="border-0 bg-transparent p-0"
      />
    </div>
  );
}