import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Eye, AlertTriangle } from "lucide-react";

interface DemoModeBannerProps {
  isVisible?: boolean;
  onDismiss?: () => void;
}

export function DemoModeBanner({ isVisible = true, onDismiss }: DemoModeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !isVisible) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mb-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Eye className="h-5 w-5 text-amber-600" />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Demo Mode Active
            </Badge>
            <AlertDescription className="text-amber-800 font-medium m-0">
              You're exploring a demonstration of ConstructionSmartTools. 
              Data is simulated and changes won't be saved.
            </AlertDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 p-1 h-auto"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}

export default DemoModeBanner;