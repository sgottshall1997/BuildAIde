import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, FileSpreadsheet, Loader2, Mail } from "lucide-react";

interface ExportData {
  projectType: string;
  area: number;
  materialQuality: string;
  timeline: string;
  estimatedCost: number;
  breakdown?: any[];
  pastProjects?: any[];
  riskAssessment?: any;
  zipCode?: string;
  description?: string;
}

interface ExportFunctionalityProps {
  data: ExportData;
  onEmailDraft?: () => void;
}

export default function ExportFunctionality({ data, onEmailDraft }: ExportFunctionalityProps) {
  const [exportFormat, setExportFormat] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!exportFormat) return;
    
    setIsExporting(true);
    try {
      const response = await fetch("/api/export-estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format: exportFormat,
          data: data
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `estimate_${data.projectType}_${timestamp}.${exportFormat === 'pdf' ? 'pdf' : 'xlsx'}`;
        a.download = filename;
        
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Export failed");
      }
    } catch (error) {
      console.error("Error exporting:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export & Share
        </CardTitle>
        <CardDescription>
          Export your estimate as PDF or spreadsheet, or draft a professional email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Export Summary */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-3">Export Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Project Type</p>
                <p className="font-medium capitalize">{data.projectType}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Area</p>
                <p className="font-medium">{data.area.toLocaleString()} sq ft</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Quality</p>
                <Badge variant="outline" className="capitalize">{data.materialQuality}</Badge>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Cost</p>
                <p className="font-semibold text-primary">{formatCurrency(data.estimatedCost)}</p>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Export Format</label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose export format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        PDF Report
                      </div>
                    </SelectItem>
                    <SelectItem value="xlsx">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Excel Spreadsheet
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col justify-end">
                <Button 
                  onClick={handleExport}
                  disabled={!exportFormat || isExporting}
                  className="w-full"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export {exportFormat?.toUpperCase()}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Export Content Preview */}
          {exportFormat && (
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">
                {exportFormat === 'pdf' ? 'PDF Report' : 'Excel Spreadsheet'} will include:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Project details and specifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Cost breakdown by category</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Timeline and phase breakdown</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Market benchmark comparison</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Similar past projects data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Risk assessment and recommendations</span>
                  </div>
                </div>
              </div>
              
              {exportFormat === 'pdf' && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    PDF will be professionally formatted with Shall's Construction branding and ready for client presentation.
                  </p>
                </div>
              )}
              
              {exportFormat === 'xlsx' && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Excel file will include multiple sheets with detailed calculations, formulas, and editable cost breakdowns.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Email Draft Option */}
          {onEmailDraft && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Draft</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generate a professional email to send with your estimate
                  </p>
                </div>
                <Button variant="outline" onClick={onEmailDraft}>
                  <Mail className="mr-2 h-4 w-4" />
                  Draft Email
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}