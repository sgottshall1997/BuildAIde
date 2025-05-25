import { useState, useCallback } from "react";
import { usageTracker } from "@/lib/usage-tracker";

export function useFreemium() {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [currentTool, setCurrentTool] = useState<string>("");

  const trackToolUsage = useCallback((toolName: string) => {
    const result = usageTracker.trackToolUsage(toolName);
    
    if (result.shouldShowSignup && !usageTracker.hasProvidedEmail()) {
      setCurrentTool(toolName);
      setShowSignupModal(true);
      return false; // Block tool usage
    }
    
    return true; // Allow tool usage
  }, []);

  const handleEmailSubmitted = useCallback((email: string) => {
    // Here you could send the email to your backend if needed
    setShowSignupModal(false);
  }, []);

  const closeSignupModal = useCallback(() => {
    setShowSignupModal(false);
  }, []);

  return {
    trackToolUsage,
    showSignupModal,
    currentTool,
    handleEmailSubmitted,
    closeSignupModal,
    hasProvidedEmail: usageTracker.hasProvidedEmail(),
    remainingUses: usageTracker.getRemainingUses(),
    totalUsage: usageTracker.getTotalUsage()
  };
}