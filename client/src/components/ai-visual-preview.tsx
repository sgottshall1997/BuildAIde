import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image, Wand2, Loader2, RefreshCw } from "lucide-react";

interface AIVisualPreviewProps {
  projectData: {
    projectType: string;
    area: number;
    materialQuality: string;
    description?: string;
  };
  onImageGenerated?: (imageUrl: string) => void;
}

export default function AIVisualPreview({ projectData, onImageGenerated }: AIVisualPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateVisualPreview = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-visual-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectData }),
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.imageUrl);
        setHasGenerated(true);
        onImageGenerated?.(data.imageUrl);
      } else {
        throw new Error("Failed to generate preview");
      }
    } catch (error) {
      console.error("Error generating visual preview:", error);
      // Show a placeholder message instead of erroring
      setHasGenerated(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/30 dark:border-purple-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Wand2 className="h-4 w-4 text-white" />
          </div>
          AI Visual Preview
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            DALL-E Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasGenerated ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
              <Image className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                See Your Project Come to Life
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Generate an AI-powered visual preview of your {projectData.projectType.toLowerCase()} with {projectData.materialQuality} finishes.
              </p>
              <Button
                onClick={generateVisualPreview}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Preview...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Visual Preview
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {imageUrl ? (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={`AI preview of ${projectData.projectType}`}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-purple-600 text-white">
                    AI Generated
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Image className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-600 dark:text-purple-400 text-sm">
                    Visual preview requires DALL-E access
                  </p>
                </div>
              </div>
            )}
            
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-200 dark:border-purple-700">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>Preview:</strong> {projectData.area} sq ft {projectData.projectType.toLowerCase()} with {projectData.materialQuality} finishes
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateVisualPreview}
                disabled={isGenerating}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New Preview
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}