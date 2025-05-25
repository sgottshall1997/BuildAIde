import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface DemoStatus {
  isDemoMode: boolean;
  demoData?: {
    project: any;
    estimates: any[];
    schedules: any[];
    tasks: any[];
  };
}

export function useDemoMode() {
  const [bannerVisible, setBannerVisible] = useState(true);

  const { data: demoStatus, isLoading } = useQuery<DemoStatus>({
    queryKey: ['/api/demo-status'],
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isDemoMode = demoStatus?.isDemoMode ?? false;
  const demoData = demoStatus?.demoData;

  const dismissBanner = () => {
    setBannerVisible(false);
    // Store dismissal in localStorage to persist across page reloads
    localStorage.setItem('demo-banner-dismissed', 'true');
  };

  const showBanner = () => {
    setBannerVisible(true);
    localStorage.removeItem('demo-banner-dismissed');
  };

  // Check localStorage on mount to see if banner was previously dismissed
  useEffect(() => {
    const wasDismissed = localStorage.getItem('demo-banner-dismissed');
    if (wasDismissed === 'true') {
      setBannerVisible(false);
    }
  }, []);

  return {
    isDemoMode,
    demoData,
    isLoading,
    bannerVisible: bannerVisible && isDemoMode,
    dismissBanner,
    showBanner,
  };
}

export default useDemoMode;