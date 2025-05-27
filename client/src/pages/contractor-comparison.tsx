import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, DollarSign, Clock, MapPin, Users } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

interface Quote {
  id: number;
  contractorName: string;
  amount: number;
  projectDescription: string;
  estimatedDuration: number;
  durationType: 'days' | 'weeks';
  notes?: string;
}

interface ComparisonResult {
  analysis: string;
  recommendedQuote: number;
  quoteInsights: Array<{
    quoteId: number;
    rating: 'excellent' | 'good' | 'caution' | 'warning';
    notes: string[];
  }>;
  marketInsights: string;
}

export default function ContractorComparison() {
  const [quotes, setQuotes] = useState<Quote[]>([
    { id: 1, contractorName: '', amount: 0, projectDescription: '', estimatedDuration: 0, durationType: 'weeks' },
    { id: 2, contractorName: '', amount: 0, projectDescription: '', estimatedDuration: 0, durationType: 'weeks' }
  ]);
  const [zipCode, setZipCode] = useState('');
  const [projectType, setProjectType] = useState('');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [loadTime, setLoadTime] = useState<number | null>(null);

  const compareQuotesMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/compare-contractor-quotes', data);
      return response.json();
    },
    onSuccess: (data) => {
      const endTime = Date.now();
      const duration = startTime ? endTime - startTime : 0;
      setLoadTime(Math.round(duration / 1000));
      setResult(data);
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('comparison-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze quotes. Please try again.",
        variant: "destructive"
      });
    }
  });

  const addQuote = () => {
    if (quotes.length < 5) {
      setQuotes([...quotes, { 
        id: Date.now(), 
        contractorName: '', 
        amount: 0, 
        projectDescription: '', 
        estimatedDuration: 0, 
        durationType: 'weeks' 
      }]);
    }
  };

  const removeQuote = (id: number) => {
    if (quotes.length > 2) {
      setQuotes(quotes.filter(q => q.id !== id));
    }
  };

  const updateQuote = (id: number, field: keyof Quote, value: any) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleCompare = () => {
    const validQuotes = quotes.filter(q => 
      q.contractorName.trim() && 
      q.amount > 0 && 
      q.projectDescription.trim() && 
      q.estimatedDuration > 0
    );

    if (validQuotes.length < 2) {
      toast({
        title: "Missing Information",
        description: "Please fill out at least 2 complete quotes to compare.",
        variant: "destructive"
      });
      return;
    }

    if (!projectType) {
      toast({
        title: "Missing Project Type",
        description: "Please select a project type for accurate comparison.",
        variant: "destructive"
      });
      return;
    }

    setStartTime(Date.now());
    compareQuotesMutation.mutate({
      quotes: validQuotes,
      zipCode,
      projectType
    });
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'good':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'caution':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'bg-green-50 border-green-200';
      case 'good': return 'bg-blue-50 border-blue-200';
      case 'caution': return 'bg-yellow-50 border-yellow-200';
      case 'warning': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-2">🧾 Contractor Quote Comparison</h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4">
          Compare multiple contractor quotes and get AI-powered recommendations to find the best value for your project.
        </p>
      </div>

      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Project Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectType">Project Type</Label>
              <Input 
                id="projectType"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                placeholder="e.g., Kitchen Remodel, Bathroom Renovation, Roof Replacement"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code (Optional)</Label>
              <Input 
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter ZIP code for local pricing insights"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Contractor Quotes</span>
            </div>
            <Button 
              onClick={addQuote} 
              disabled={quotes.length >= 5}
              variant="outline"
              size="sm"
            >
              Add Quote
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {quotes.map((quote, index) => (
            <div key={quote.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Quote #{index + 1}</h3>
                {quotes.length > 2 && (
                  <Button 
                    onClick={() => removeQuote(quote.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Contractor Name</Label>
                  <Input 
                    value={quote.contractorName}
                    onChange={(e) => updateQuote(quote.id, 'contractorName', e.target.value)}
                    placeholder="Enter contractor name"
                  />
                </div>
                <div>
                  <Label>Quote Amount ($)</Label>
                  <Input 
                    type="number"
                    value={quote.amount || ''}
                    onChange={(e) => updateQuote(quote.id, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="Enter total quote amount"
                  />
                </div>
              </div>

              <div>
                <Label>Project Description/Scope</Label>
                <Textarea 
                  value={quote.projectDescription}
                  onChange={(e) => updateQuote(quote.id, 'projectDescription', e.target.value)}
                  placeholder="Describe what's included in this quote"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Estimated Duration</Label>
                  <Input 
                    type="number"
                    value={quote.estimatedDuration || ''}
                    onChange={(e) => updateQuote(quote.id, 'estimatedDuration', parseFloat(e.target.value) || 0)}
                    placeholder="Enter duration"
                  />
                </div>
                <div>
                  <Label>Duration Type</Label>
                  <Select 
                    value={quote.durationType} 
                    onValueChange={(value: 'days' | 'weeks') => updateQuote(quote.id, 'durationType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Additional Notes (Optional)</Label>
                <Textarea 
                  value={quote.notes || ''}
                  onChange={(e) => updateQuote(quote.id, 'notes', e.target.value)}
                  placeholder="Any additional details about this quote"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Compare Button */}
      <Card>
        <CardContent className="p-6">
          <Button 
            onClick={handleCompare}
            disabled={compareQuotesMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {compareQuotesMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Quotes...
              </>
            ) : (
              <>
                <Users className="w-5 h-5 mr-2" />
                Compare Quotes with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div id="comparison-results" className="space-y-6">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-green-800">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6" />
                  <span>Quote Comparison Results</span>
                </div>
                {loadTime && (
                  <Badge variant="secondary" className="bg-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {loadTime}s
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-2">AI Analysis Summary</h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {result.analysis.split('\n').map((paragraph, index) => (
                    paragraph.trim() && <p key={index} className="mb-2">{paragraph}</p>
                  ))}
                </div>
              </div>

              {result.recommendedQuote && (
                <div className="bg-green-100 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Recommended Choice
                  </h3>
                  <p className="text-green-700">
                    Quote #{result.recommendedQuote} appears to be the best value based on market pricing and project scope.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Individual Quote Insights */}
          <div className="grid gap-4">
            {result.quoteInsights.map((insight, index) => (
              <Card key={insight.quoteId} className={`border-2 ${getRatingColor(insight.rating)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getRatingIcon(insight.rating)}
                      <span>Quote #{insight.quoteId}</span>
                      <Badge variant="outline" className="capitalize">
                        {insight.rating}
                      </Badge>
                    </div>
                    {insight.quoteId === result.recommendedQuote && (
                      <Badge className="bg-green-600">Recommended</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insight.notes.map((note, noteIndex) => (
                      <li key={noteIndex} className="flex items-start space-x-2">
                        <span className="text-gray-500 mt-1">•</span>
                        <span className="text-gray-700">{note}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Market Insights */}
          {result.marketInsights && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Market Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {result.marketInsights.split('\n').map((paragraph, index) => (
                    paragraph.trim() && <p key={index} className="mb-2">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}