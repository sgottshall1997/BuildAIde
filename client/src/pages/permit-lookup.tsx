import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Calendar, CheckCircle, Clock, AlertCircle, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Permit {
  id: string;
  permitNumber: string;
  address: string;
  status: 'active' | 'expired' | 'approved' | 'pending' | 'closed';
  scopeOfWork: string;
  issueDate: string;
  inspectionDate?: string;
  finalDate?: string;
  permitType: string;
  contractorName?: string;
  estimatedValue?: number;
  aiSummary?: string;
}

export default function PermitLookup() {
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("Kensington");
  const [state, setState] = useState("MD");
  const [zipCode, setZipCode] = useState("20895");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Combine address parts into the proper format for search
  const fullAddress = `${streetAddress}, ${city}, ${state} ${zipCode}`;

  const { data: permits, refetch } = useQuery({
    queryKey: ['/api/permit-lookup', { address: fullAddress, zipCode: zipCode }],
    enabled: false // Only search when user clicks search
  });

  const handleSearch = async () => {
    if (!streetAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a street address to search for permits",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      await refetch();
      toast({
        title: "Search Complete",
        description: `Found permit records for ${searchAddress}`,
      });
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to lookup permits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const generatePermitSummary = async (permit: Permit) => {
    try {
      const response = await fetch("/api/analyze-permit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permit }),
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Analysis Complete",
          description: "Permit analysis generated successfully",
        });
        refetch(); // Refresh to show updated summary
      }
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to generate permit analysis",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'approved':
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <Building className="h-8 w-8 text-blue-600" />
          Montgomery County Permit Lookup
        </h1>
        <p className="text-slate-600">
          Research permit history and current status for any property
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Property Search
          </CardTitle>
          <CardDescription>
            Enter a property address to find all associated permits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📍 Enter Address Information:</h4>
            <div className="text-sm text-blue-800">
              Fill in the fields below - they'll be automatically combined into the correct format for permit search.
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
              <Input
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="123 Summit Ave"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kensington"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="MD"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="20895"
              />
            </div>
          </div>
          
          {streetAddress && (
            <div className="mb-4 p-2 bg-slate-50 border rounded">
              <span className="text-sm text-slate-600">Search Address: </span>
              <span className="font-medium">{fullAddress}</span>
            </div>
          )}
          
          <div className="flex gap-4">
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {permits && Array.isArray(permits) && permits.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Found {permits.length} permit{permits.length !== 1 ? 's' : ''} for {searchAddress}
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {permits.map((permit: Permit) => (
              <Card key={permit.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Permit #{permit.permitNumber}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {permit.permitType} • {permit.address}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(permit.status)}
                      <Badge className={getStatusColor(permit.status)}>
                        {permit.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Permit Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-slate-700 mb-2">Scope of Work</h4>
                      <p className="text-slate-600">{permit.scopeOfWork}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">
                          Issued: {new Date(permit.issueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {permit.inspectionDate && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-slate-600">
                            Inspected: {new Date(permit.inspectionDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {permit.finalDate && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-slate-600">
                            Finalized: {new Date(permit.finalDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(permit.contractorName || permit.estimatedValue) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2 border-t">
                      {permit.contractorName && (
                        <div>
                          <span className="font-medium text-slate-700">Contractor: </span>
                          <span className="text-slate-600">{permit.contractorName}</span>
                        </div>
                      )}
                      {permit.estimatedValue && (
                        <div>
                          <span className="font-medium text-slate-700">Est. Value: </span>
                          <span className="text-slate-600">${permit.estimatedValue.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Summary */}
                  {permit.aiSummary ? (
                    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Permit Analysis</span>
                      </div>
                      <p className="text-sm text-blue-700">{permit.aiSummary}</p>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generatePermitSummary(permit)}
                      className="w-full flex items-center gap-2"
                    >
                      <Building className="h-4 w-4" />
                      Generate Permit Analysis
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {permits && Array.isArray(permits) && permits.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No permits found</h3>
            <p className="text-slate-600">No permit records found for this address.</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Permit Status Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <div className="font-medium">Active</div>
                <div className="text-slate-600">Work in progress</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <div className="font-medium">Approved/Closed</div>
                <div className="text-slate-600">Work completed</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <div>
                <div className="font-medium">Expired</div>
                <div className="text-slate-600">Permit lapsed</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="font-medium">Pending</div>
                <div className="text-slate-600">Under review</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}