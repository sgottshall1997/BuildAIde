import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Home, MapPin, Calendar, DollarSign, Bed, Bath, Square, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Listing {
  id: string;
  address: string;
  price: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  daysOnMarket: number;
  status: string;
  zipCode: string;
  description?: string;
  aiSummary?: string;
  listingUrl?: string;
  photos?: string[];
}

export default function RealEstateListings() {
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [maxDaysOnMarket, setMaxDaysOnMarket] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [minBathrooms, setMinBathrooms] = useState("");
  const [zipCode, setZipCode] = useState("20895"); // Kensington, MD default
  const { toast } = useToast();

  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ['/api/real-estate-listings', {
      priceMin: priceMin || undefined,
      priceMax: priceMax || undefined,
      maxDaysOnMarket: maxDaysOnMarket || undefined,
      minBedrooms: minBedrooms || undefined,
      minBathrooms: minBathrooms || undefined,
      zipCode
    }],
    enabled: true
  });

  const handleSearch = () => {
    refetch();
    toast({
      title: "Searching Listings",
      description: `Finding properties in ${zipCode} with your criteria...`,
    });
  };

  const generateAISummary = async (listing: Listing) => {
    try {
      const response = await fetch("/api/analyze-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing }),
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "AI Analysis Complete",
          description: "Property analysis generated successfully",
        });
        refetch(); // Refresh to show updated summary
      }
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to generate property analysis",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <Home className="h-8 w-8 text-blue-600" />
          Kensington Real Estate Listings
        </h1>
        <p className="text-slate-600">
          Find investment opportunities in Kensington, MD and surrounding areas
        </p>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Zip Code</label>
              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="20895"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Min Price</label>
              <Input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="300000"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Max Price</label>
              <Input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="800000"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Max Days on Market</label>
              <Input
                type="number"
                value={maxDaysOnMarket}
                onChange={(e) => setMaxDaysOnMarket(e.target.value)}
                placeholder="90"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Min Bedrooms</label>
              <Select value={minBedrooms} onValueChange={setMinBedrooms}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Min Bathrooms</label>
              <Select value={minBathrooms} onValueChange={setMinBathrooms}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSearch} className="w-full flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Properties
          </Button>
        </CardContent>
      </Card>

      {/* Listings Results */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading listings...</p>
        </div>
      )}

      {listings && listings.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {listings.map((listing: Listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      {listing.address}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${listing.price.toLocaleString()}
                      </span>
                      <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                        {listing.status}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Calendar className="h-4 w-4" />
                      {listing.daysOnMarket} days
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Property Details */}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4 text-slate-500" />
                    {listing.bedrooms} bed
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4 text-slate-500" />
                    {listing.bathrooms} bath
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4 text-slate-500" />
                    {listing.sqft?.toLocaleString()} sqft
                  </div>
                  <div className="text-slate-600">
                    ${Math.round(listing.price / (listing.sqft || 1))}/sqft
                  </div>
                </div>

                {/* AI Summary */}
                {listing.aiSummary ? (
                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Investment Analysis</span>
                    </div>
                    <p className="text-sm text-blue-700">{listing.aiSummary}</p>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateAISummary(listing)}
                    className="w-full flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Generate Investment Analysis
                  </Button>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {listing.listingUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={listing.listingUrl} target="_blank" rel="noopener noreferrer">
                        View Listing
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Save to Prospects
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {listings && listings.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <Home className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No listings found</h3>
            <p className="text-slate-600">Try adjusting your search criteria to see more results.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}