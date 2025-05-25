import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlayCircle, 
  X, 
  Users, 
  Hammer, 
  TrendingUp, 
  ChevronRight,
  BarChart3,
  Eye
} from 'lucide-react';
import { getIsDemoMode, disableDemoMode } from '@/lib/demo-mode';
import { useDemoUser, logUserInteraction, type DemoUserType } from '@/hooks/useDemoUser';

export default function DemoModeBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const isDemoMode = getIsDemoMode();
  const { demoState, startDemoUser, nextStep, getCurrentUserData, getCurrentStepData } = useDemoUser();

  if (!isDemoMode || !isVisible) return null;

  const handleStartDemo = (userType: DemoUserType) => {
    startDemoUser(userType);
    logUserInteraction('demo_banner_user_selected', { userType });
  };

  const handleClose = () => {
    setIsVisible(false);
    logUserInteraction('demo_banner_closed');
  };

  const handleDisableDemo = () => {
    disableDemoMode();
    setIsVisible(false);
    logUserInteraction('demo_mode_disabled');
    window.location.reload();
  };

  const currentUser = getCurrentUserData();
  const currentStep = getCurrentStepData();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white shadow-lg">
      <Card className="mx-4 mt-2 mb-2 border-2 border-white/20 bg-white/10 backdrop-blur-sm">
        <CardContent className="p-4">
          {!demoState.isActive ? (
            // Demo Mode Selector
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <Badge className="bg-white/20 text-white border-white/30">
                    DEMO MODE
                  </Badge>
                </div>
                <span className="text-sm font-medium">
                  Experience ConstructionSmartTools as different user types
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleStartDemo('first-time-homeowner')}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Homeowner Demo
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleStartDemo('experienced-contractor')}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Hammer className="w-4 h-4 mr-1" />
                    Contractor Demo
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleStartDemo('house-flipper')}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Investor Demo
                  </Button>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDisableDemo}
                    className="text-white/80 hover:text-white hover:bg-white/20"
                  >
                    Exit Demo
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClose}
                    className="text-white/80 hover:text-white hover:bg-white/20 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Active Demo Progress
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  <Badge className="bg-green-500/80 text-white">
                    DEMO ACTIVE
                  </Badge>
                </div>
                
                {currentUser && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {currentUser.name}
                    </span>
                    <div className="w-px h-4 bg-white/30" />
                    <span className="text-sm text-white/90">
                      Step {demoState.currentStep + 1} of {currentUser.journey.length}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {currentStep && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white/90">Next:</span>
                    <span className="font-medium">{currentStep.action}</span>
                    <Button
                      size="sm"
                      onClick={nextStep}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-3 py-1"
                    >
                      Continue
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClose}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}