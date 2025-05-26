import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  Download, 
  FileText, 
  Printer, 
  Share2,
  CheckCircle,
  FileSpreadsheet,
  FileImage
} from "lucide-react";

interface ExportData {
  title: string;
  data: any;
  projectDetails?: Record<string, any>;
  timestamp?: Date;
}

interface EnhancedExportOptionsProps {
  data: ExportData;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showLabels?: boolean;
}

export function EnhancedExportOptions({ 
  data, 
  className = "", 
  variant = 'default',
  showLabels = true 
}: EnhancedExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const { toast } = useToast();

  const formatDataForCopy = (exportData: ExportData): string => {
    const timestamp = exportData.timestamp || new Date();
    const lines = [
      `${exportData.title}`,
      `Generated: ${timestamp.toLocaleDateString()} at ${timestamp.toLocaleTimeString()}`,
      `\n${'='.repeat(50)}\n`
    ];

    // Add project details
    if (exportData.projectDetails) {
      lines.push('PROJECT DETAILS:');
      Object.entries(exportData.projectDetails).forEach(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        lines.push(`${formattedKey}: ${value}`);
      });
      lines.push('\n');
    }

    // Format main data
    lines.push('RESULTS:');
    if (typeof exportData.data === 'object') {
      Object.entries(exportData.data).forEach(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        if (typeof value === 'number') {
          const formattedValue = key.toLowerCase().includes('cost') || key.toLowerCase().includes('price') 
            ? `$${value.toLocaleString()}` 
            : value.toLocaleString();
          lines.push(`${formattedKey}: ${formattedValue}`);
        } else if (Array.isArray(value)) {
          lines.push(`${formattedKey}:`);
          value.forEach((item, index) => {
            lines.push(`  ${index + 1}. ${item}`);
          });
        } else {
          lines.push(`${formattedKey}: ${value}`);
        }
      });
    }

    return lines.join('\n');
  };

  const formatDataForCSV = (exportData: ExportData): string => {
    const rows = [
      ['Field', 'Value'],
      ['Report Title', exportData.title],
      ['Generated Date', (exportData.timestamp || new Date()).toLocaleDateString()],
      ['Generated Time', (exportData.timestamp || new Date()).toLocaleTimeString()],
      ['', ''] // Empty row
    ];

    // Add project details
    if (exportData.projectDetails) {
      rows.push(['PROJECT DETAILS', '']);
      Object.entries(exportData.projectDetails).forEach(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        rows.push([formattedKey, String(value)]);
      });
      rows.push(['', '']); // Empty row
    }

    // Add main data
    if (typeof exportData.data === 'object') {
      rows.push(['RESULTS', '']);
      Object.entries(exportData.data).forEach(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        if (Array.isArray(value)) {
          rows.push([formattedKey, value.join('; ')]);
        } else {
          rows.push([formattedKey, String(value)]);
        }
      });
    }

    return rows.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  };

  const copyToClipboard = async () => {
    try {
      const formattedData = formatDataForCopy(data);
      await navigator.clipboard.writeText(formattedData);
      setCopiedItem('text');
      toast({
        title: "Copied to clipboard!",
        description: "Results have been copied to your clipboard.",
      });
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadAsText = () => {
    const formattedData = formatDataForCopy(data);
    const blob = new Blob([formattedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your text file is being downloaded.",
    });
  };

  const downloadAsCSV = () => {
    const csvData = formatDataForCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "CSV downloaded",
      description: "Your spreadsheet file is ready.",
    });
  };

  const handlePrint = () => {
    const formattedData = formatDataForCopy(data);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${data.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
              pre { background: #f8fafc; padding: 15px; border-radius: 8px; overflow: auto; }
            </style>
          </head>
          <body>
            <h1>${data.title}</h1>
            <pre>${formattedData}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Render different variants
  if (variant === 'minimal') {
    return (
      <div className={`flex gap-2 ${className}`}>
        <Button
          size="sm"
          variant="outline"
          onClick={copyToClipboard}
          className="text-xs"
        >
          {copiedItem === 'text' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={downloadAsText}
          className="text-xs"
        >
          <Download className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <Button
          size="sm"
          variant="outline"
          onClick={copyToClipboard}
          className="flex items-center gap-1.5"
        >
          {copiedItem === 'text' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {showLabels && <span className="text-xs">Copy</span>}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={downloadAsText}
          className="flex items-center gap-1.5"
        >
          <FileText className="w-3 h-3" />
          {showLabels && <span className="text-xs">Text</span>}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={downloadAsCSV}
          className="flex items-center gap-1.5"
        >
          <FileSpreadsheet className="w-3 h-3" />
          {showLabels && <span className="text-xs">CSV</span>}
        </Button>
      </div>
    );
  }

  // Default variant - full featured
  return (
    <Card className={`border-2 border-slate-200 bg-slate-50 ${className}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Export Results</h3>
            <p className="text-sm text-slate-600">Save or share your analysis</p>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Ready to Export
          </Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="w-full flex flex-col gap-2 h-auto py-3 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
          >
            {copiedItem === 'text' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5 text-blue-600" />
            )}
            <span className="text-xs font-medium">
              {copiedItem === 'text' ? 'Copied!' : 'Copy'}
            </span>
          </Button>

          <Button
            onClick={downloadAsText}
            variant="outline"
            className="w-full flex flex-col gap-2 h-auto py-3 border-green-200 hover:border-green-400 hover:bg-green-50"
          >
            <FileText className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium">Text File</span>
          </Button>

          <Button
            onClick={downloadAsCSV}
            variant="outline"
            className="w-full flex flex-col gap-2 h-auto py-3 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
          >
            <FileSpreadsheet className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-medium">CSV File</span>
          </Button>

          <Button
            onClick={handlePrint}
            variant="outline"
            className="w-full flex flex-col gap-2 h-auto py-3 border-orange-200 hover:border-orange-400 hover:bg-orange-50"
          >
            <Printer className="w-5 h-5 text-orange-600" />
            <span className="text-xs font-medium">Print</span>
          </Button>
        </div>

        <div className="mt-4 text-xs text-slate-500 text-center">
          All exports include project details and timestamp for your records
        </div>
      </CardContent>
    </Card>
  );
}