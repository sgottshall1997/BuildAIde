import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ZipCodeLookupProps {
  value: string;
  onChange: (value: string) => void;
  onLocationData?: (data: { city: string; state: string; zipCode: string }) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

interface LocationData {
  city: string;
  state: string;
  zipCode: string;
  formattedAddress?: string;
}

export default function ZipCodeLookup({ 
  value, 
  onChange, 
  onLocationData,
  label = "ZIP Code",
  placeholder = "Enter ZIP code",
  required = false
}: ZipCodeLookupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [error, setError] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value && value.length >= 5) {
        lookupZipCode(value);
      } else {
        setLocationData(null);
        setError("");
        setIsValid(null);
      }
    }, 500); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [value]);

  const lookupZipCode = async (zipCode: string) => {
    // Basic ZIP code format validation
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(zipCode)) {
      setError("Please enter a valid ZIP code (e.g., 12345 or 12345-6789)");
      setIsValid(false);
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const response = await apiRequest("POST", "/api/lookup-zipcode", {
        zipCode: zipCode
      });
      
      if (response.success && response.data) {
        const data: LocationData = {
          city: response.data.city || "",
          state: response.data.state || "",
          zipCode: zipCode,
          formattedAddress: response.data.formattedAddress || ""
        };
        
        setLocationData(data);
        setIsValid(true);
        setError("");
        
        if (onLocationData) {
          onLocationData(data);
        }
      } else {
        setError("ZIP code not found. Please verify the ZIP code is correct.");
        setIsValid(false);
        setLocationData(null);
      }
    } catch (error: any) {
      console.error("ZIP code lookup error:", error);
      setError("Unable to verify ZIP code. Please check your internet connection.");
      setIsValid(false);
      setLocationData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = () => {
    let baseClass = "pr-10";
    
    if (isLoading) {
      return baseClass + " border-blue-300";
    }
    
    if (isValid === true) {
      return baseClass + " border-green-500 focus:border-green-500";
    }
    
    if (isValid === false || error) {
      return baseClass + " border-red-500 focus:border-red-500";
    }
    
    return baseClass;
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    
    if (isValid === true) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    if (isValid === false || error) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    
    return <MapPin className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="zipcode" className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id="zipcode"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={getInputClassName()}
          maxLength={10}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {getStatusIcon()}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {locationData && isValid && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">
              {locationData.city}, {locationData.state} {locationData.zipCode}
            </span>
          </p>
          {locationData.formattedAddress && (
            <p className="text-xs text-green-700 mt-1">
              {locationData.formattedAddress}
            </p>
          )}
        </div>
      )}
    </div>
  );
}