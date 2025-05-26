import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, ArrowLeft, Upload, DollarSign, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ModeSwitcher } from "@/components/mode-toggle";
import { ResultsExport } from "@/components/ui/results-export";

interface QuoteAnalysis {
  contractor: string;
  totalCost: number;
  redFlags: string[];
  strengths: string[];
  recommendation: string;
  priceReasonableness: 'low' | 'fair' | 'high';
}

export default function QuoteCompare() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<QuoteAnalysis[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const addQuote = () => {
    setQuotes([...quotes, {
      id: Date.now(),
      contractorName: '',
      totalCost: '',
      timeline: '',
      description: '',
      breakdown: ''
    }]);
  };

  const updateQuote = (id: number, field: string, value: string) => {
    setQuotes(quotes.map(quote => 
      quote.id === id ? { ...quote, [field]: value } : quote
    ));
  };

  const removeQuote = (id: number) => {
    setQuotes(quotes.filter(quote => quote.id !== id));
  };

  const analyzeQuotes = async () => {
    if (quotes.length < 2) {
      toast({
        title: "Need More Quotes",
        description: "Add at least 2 contractor quotes to compare.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotes }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data.analysis);
        toast({
          title: "Analysis Complete!",
          description: "Your contractor quotes have been analyzed.",
        });
      } else {
        throw new Error("Analysis failed");
      }
    } catch (error) {
      console.error("Error analyzing quotes:", error);
      toast({
        title: "Analysis Error",
        description: "We couldn't analyze your quotes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPriceColor = (reasonableness: string) => {
    switch (reasonableness) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'fair': return 'text-blue-600 bg-blue-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/consumer-dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Contractor Quote Analyzer</h1>
              <p className="text-slate-600">Compare quotes and spot red flags before you hire</p>
            </div>
          </div>
          <ModeSwitcher currentMode="consumer" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quote Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  Add Contractor Quotes
                </CardTitle>
                <CardDescription>
                  Enter details from each contractor's quote for comparison
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quotes.map((quote, index) => (
                  <Card key={quote.id} className="bg-slate-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Quote #{index + 1}</CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeQuote(quote.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Contractor Name</Label>
                          <Input
                            placeholder="ABC Construction"
                            value={quote.contractorName}
                            onChange={(e) => updateQuote(quote.id, 'contractorName', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Total Cost</Label>
                          <Input
                            type="number"
                            placeholder="25000"
                            value={quote.totalCost}
                            onChange={(e) => updateQuote(quote.id, 'totalCost', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Timeline</Label>
                        <Input
                          placeholder="4-6 weeks"
                          value={quote.timeline}
                          onChange={(e) => updateQuote(quote.id, 'timeline', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Work Description</Label>
                        <Textarea
                          placeholder="Kitchen remodel including cabinets, countertops, flooring..."
                          value={quote.description}
                          onChange={(e) => updateQuote(quote.id, 'description', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Cost Breakdown (if provided)</Label>
                        <Textarea
                          placeholder="Materials: $15,000, Labor: $8,000, Permits: $2,000"
                          value={quote.breakdown}
                          onChange={(e) => updateQuote(quote.id, 'breakdown', e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex gap-3">
                  <Button onClick={addQuote} variant="outline" className="flex-1">
                    Add Another Quote
                  </Button>
                  <Button 
                    onClick={analyzeQuotes}
                    disabled={isAnalyzing || quotes.length < 2}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Quotes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div>
            {analysis ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-800">Analysis Complete</CardTitle>
                    <CardDescription>
                      Here's what we found when comparing your contractor quotes
                    </CardDescription>
                  </CardHeader>
                </Card>

                {analysis.map((result, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{result.contractor}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriceColor(result.priceReasonableness)}>
                            {result.priceReasonableness === 'low' && 'Great Price'}
                            {result.priceReasonableness === 'fair' && 'Fair Price'}
                            {result.priceReasonableness === 'high' && 'High Price'}
                          </Badge>
                          <div className="text-xl font-bold">
                            ${result.totalCost.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Red Flags */}
                      {result.redFlags.length > 0 && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Red Flags
                          </h4>
                          <ul className="space-y-1">
                            {result.redFlags.map((flag, idx) => (
                              <li key={idx} className="text-red-700 text-sm flex items-start gap-2">
                                <div className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Strengths */}
                      {result.strengths.length > 0 && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Strengths
                          </h4>
                          <ul className="space-y-1">
                            {result.strengths.map((strength, idx) => (
                              <li key={idx} className="text-green-700 text-sm flex items-start gap-2">
                                <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendation */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">Our Recommendation</h4>
                        <p className="text-blue-700 text-sm">{result.recommendation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-50 h-full">
                <CardContent className="flex items-center justify-center h-full text-center py-12">
                  <div className="space-y-4">
                    <DollarSign className="w-16 h-16 text-slate-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        Ready to Compare?
                      </h3>
                      <p className="text-slate-500">
                        Add at least 2 contractor quotes and we'll analyze them for red flags, pricing, and give you hiring recommendations
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}