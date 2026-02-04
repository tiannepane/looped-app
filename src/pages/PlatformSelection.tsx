import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import ScreenHeader from "@/components/ScreenHeader";
import { useToast } from "@/hooks/use-toast";

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const platforms: Platform[] = [
  { id: "facebook", name: "Facebook Marketplace", icon: "📘", color: "bg-blue-500" },
  { id: "kijiji", name: "Kijiji", icon: "🟣", color: "bg-purple-500" },
  { id: "carrot", name: "Carrot", icon: "🥕", color: "bg-orange-500" },
];

const PlatformSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    facebook: true,
    kijiji: true,
    carrot: true,
  });
  const [isPosting, setIsPosting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const togglePlatform = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const enabledCount = Object.values(enabled).filter(Boolean).length;

  const handlePost = async () => {
    setIsPosting(true);
    
    // Simulate posting delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsPosting(false);
    setIsSuccess(true);
    
    toast({
      title: "Posted successfully!",
      description: `Your item is now live on ${enabledCount} platform${enabledCount > 1 ? "s" : ""}.`,
    });

    // Navigate to dashboard after brief success state
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title="Select Platforms" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Where should we post this?
          </p>

          {/* Platform toggles */}
          <div className="space-y-3">
            {platforms.map((platform) => (
              <Card
                key={platform.id}
                className="p-4 flex items-center justify-between bg-card border-border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="font-medium text-foreground">
                    {platform.name}
                  </span>
                </div>
                <Switch
                  checked={enabled[platform.id]}
                  onCheckedChange={() => togglePlatform(platform.id)}
                />
              </Card>
            ))}
          </div>

          {/* Summary card */}
          <Card className="p-4 bg-secondary/50 border-border mt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                <span className="text-3xl">🪑</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  Mid-Century Coffee Table
                </h3>
                <p className="text-primary font-bold">$200</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Posting to {enabledCount} platform{enabledCount !== 1 && "s"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Post button */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={handlePost}
          disabled={enabledCount === 0 || isPosting || isSuccess}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-300 ease-out disabled:opacity-50"
        >
          {isPosting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Posting...
            </>
          ) : isSuccess ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Posted!
            </>
          ) : (
            `Post to ${enabledCount > 1 ? "All " + enabledCount : ""} Platform${enabledCount !== 1 ? "s" : ""}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default PlatformSelection;
