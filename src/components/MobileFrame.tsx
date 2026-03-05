import { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
}

const MobileFrame = ({ children }: MobileFrameProps) => {
  const isSmallScreen = window.innerWidth <= 768;

  if (isSmallScreen) {
    return (
      <div
        className="w-full bg-background overflow-hidden relative"
        style={{
          height: '100dvh',
          minHeight: '-webkit-fill-available',
          paddingBottom: 'env(safe-area-inset-bottom, 20px)'
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
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
};

export default MobileFrame;