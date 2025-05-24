import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, DollarSign, Loader2 } from "lucide-react";

interface PastProject {
  id: number;
  address: string;
  zipCode: string;
  projectType: string;
  squareFootage: number;
  finishLevel: string;
  year: number;
  finalCost: number;
  notes: string;
}

interface PastProjectsComparisonProps {
  projectType: string;
  zipCode?: string;
  squareFootage: number;
  materialQuality: string;
  estimatedCost: number;
}

export default function PastProjectsComparison({
  projectType,
  zipCode,
  squareFootage,
  materialQuality,
  estimatedCost
}: PastProjectsComparisonProps) {
  const [similarProjects, setSimilarProjects] = useState<PastProject[]>([]);
  const [averageCostPerSqFt, setAverageCostPerSqFt] = useState<number>(0);
  const [comparison, setComparison] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const findSimilarProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/similar-past-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectType,
          zipCode,
          squareFootage,
          materialQuality,
          estimatedCost
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSimilarProjects(data.similarProjects);
        setAverageCostPerSqFt(data.averageCostPerSqFt);
        setComparison(data.comparison);
      } else {
        console.error("Failed to fetch similar projects");
      }
    } catch (error) {
      console.error("Error fetching similar projects:", error);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
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

  const getFinishLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'luxury': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'premium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'standard': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Past Projects with Similar Specs
        </CardTitle>
        <CardDescription>
          Compare this estimate with Spence the Builder previous similar projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasSearched ? (
          <Button 
            onClick={findSimilarProjects} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding Similar Projects...
              </>
            ) : (
              "Find Similar Past Projects"
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            {similarProjects.length > 0 ? (
              <>
                {/* Comparison Summary */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">{comparison}</p>
                  {averageCostPerSqFt > 0 && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Average cost from similar projects: <strong>{formatCurrency(averageCostPerSqFt)}/sq ft</strong>
                    </p>
                  )}
                </div>

                {/* Similar Projects List */}
                <div className="space-y-3">
                  {similarProjects.map((project) => (
                    <div 
                      key={project.id} 
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{project.address}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {project.year} • {project.squareFootage.toLocaleString()} sq ft
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-semibold">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrency(project.finalCost)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatCurrency(Math.round(project.finalCost / project.squareFootage))}/sq ft
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getFinishLevelColor(project.finishLevel)}>
                          {project.finishLevel}
                        </Badge>
                        <Badge variant="outline">
                          {project.zipCode}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        {project.notes}
                      </p>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setHasSearched(false);
                    setSimilarProjects([]);
                    setComparison("");
                  }}
                  className="w-full"
                >
                  Search Again
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Similar Projects Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No past projects match the current specifications closely enough for comparison.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setHasSearched(false);
                    setSimilarProjects([]);
                  }}
                >
                  Try Different Search
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}