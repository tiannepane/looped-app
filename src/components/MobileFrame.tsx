import { ReactNode, useState, useEffect } from "react";

interface MobileFrameProps {
  children: ReactNode;
}

const MobileFrame = ({ children }: MobileFrameProps) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Prevent hydration mismatch — show nothing until client-side JS runs
  if (!mounted) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="w-[390px] h-[844px] bg-background rounded-[40px] shadow-2xl overflow-hidden relative border-8 border-foreground/10">
          <div className="h-11 bg-background flex items-center justify-between px-6">
            <span className="text-xs font-medium text-foreground">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-foreground rounded-sm relative">
                <div className="absolute inset-0.5 right-1 bg-foreground rounded-sm" />
              </div>
            </div>
          </div>
          <div className="h-[calc(100%-44px)] overflow-hidden" style={{ transform: 'translateZ(0)' }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  if (isSmallScreen) {
    return (
      <div
        className="w-full bg-background relative flex flex-col"
        style={{
          height: '100dvh',
          minHeight: '-webkit-fill-available',
        }}
      >
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
        <div style={{ height: '34px', flexShrink: 0 }} />
      </div>
    );
  }

  // Desktop: full screen layout (no phone frame)
  return (
    <div className="w-full h-screen bg-background overflow-hidden relative">
      {children}
    </div>
  );
};

export default MobileFrame;