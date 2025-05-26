import { ReactNode } from 'react';
import PersistentNavbar from '@/components/persistent-navbar';
import Footer from '@/components/footer';
import { useLocation } from 'wouter';

interface PageLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  showBackButton?: boolean;
  showModeSwitch?: boolean;
  currentMode?: 'consumer' | 'pro';
  className?: string;
}

export default function PageLayout({
  children,
  pageTitle,
  showBackButton = true,
  showModeSwitch = true,
  currentMode = 'pro',
  className = ""
}: PageLayoutProps) {
  const [location] = useLocation();
  
  // Determine current mode based on route if not explicitly provided
  const detectedMode = location.includes('/consumer') ? 'consumer' : 'pro';
  const mode = currentMode || detectedMode;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Persistent Navbar */}
      <PersistentNavbar
        pageTitle={pageTitle}
        showBackButton={showBackButton}
        showModeSwitch={showModeSwitch}
        currentMode={mode}
      />

      {/* Main Content */}
      <main className={`flex-1 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}