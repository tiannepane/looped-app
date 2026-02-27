import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, ChevronDown, ChevronUp, ClipboardCopy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import ScreenHeader from "@/components/ScreenHeader";
import { useToast } from "@/hooks/use-toast";

const platforms = [
  {
    id: "facebook",
    name: "Facebook Marketplace",
    sub: "Largest audience",
    icon: "📘",
    url: "https://m.facebook.com/marketplace/create",
  },
  {
    id: "kijiji",
    name: "Kijiji",
    sub: "Popular for local pickup",
    icon: "🟣",
    url: "https://m.kijiji.ca/p-post-ad.html",
  },
  {
    id: "karrot",
    name: "Karrot",
    sub: "Best for neighborhoods",
    icon: "🥕",
    url: "https://ca.karrotmarket.com/create",
  },
];

const PostToPlatforms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const {
    photos = [],
    itemTitle = "Your Item",
    category = "Other",
    price = 100,
    location: itemLocation = "",
    description = "",
    isMovingSale = false,
    movingDate = null,
  } = (location.state as Record<string, any>) || {};

  const [copied, setCopied] = useState(false);
  const [showHow, setShowHow] = useState(false);
  const [markedPosted, setMarkedPosted] = useState(false);
  const [openedPlatforms, setOpenedPlatforms] = useState<string[]>([]);

  const listingText = [
    `${itemTitle} - $${price}`,
    description || "",
    `📍 ${itemLocation}`,
    isMovingSale && movingDate ? `Moving sale - must sell by ${movingDate}.` : "",
    "Available for pickup. Cash preferred.",
  ]
    .filter(Boolean)
    .join("\n");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(listingText);
      setCopied(true);
      toast({ title: "✓ Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleCopyAndOpen = async (platform: typeof platforms[0]) => {
    try {
      await navigator.clipboard.writeText(listingText);
      toast({ title: `✓ Copied! Opening ${platform.name}...` });
      setOpenedPlatforms((p) => [...new Set([...p, platform.id])]);
      setTimeout(() => {
        window.open(platform.url, "_blank");
      }, 500);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleDownloadPhotos = () => {
    photos.forEach((photo: string, i: number) => {
      const link = document.createElement("a");
      link.href = photo;
      link.download = `${itemTitle.replace(/\s+/g, "-")}-${i + 1}.jpg`;
      link.click();
    });
    toast({ title: "📥 Photos downloaded!" });
  };

  const handleDone = () => {
    const enabledPlatforms = openedPlatforms.length > 0 ? openedPlatforms : ["facebook", "kijiji", "karrot"];
    navigate("/dashboard", {
      state: {
        newListing: {
          photos,
          itemTitle,
          category,
          price,
          platforms: enabledPlatforms,
        },
      },
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title="Post to Platforms" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Preview card */}
          <Card className="p-3 bg-card border-border">
            <div className="flex gap-3 mb-3">
              {photos.length > 0 ? (
                <img src={photos[0]} alt="Item" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center text-3xl flex-shrink-0">📦</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{itemTitle}</h3>
                <p className="text-primary font-bold">${price}</p>
                {itemLocation && <p className="text-xs text-muted-foreground">📍 {itemLocation}</p>}
              </div>
            </div>

            {/* Generated listing text */}
            <div className="bg-muted/50 rounded-xl p-3 mb-3">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{listingText}</pre>
            </div>

            {/* Copy & Download buttons */}
            <div className="space-y-2">
              <Button
                onClick={copyToClipboard}
                className="w-full h-12 font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-none"
              >
                {copied ? (
                  <><Check className="w-4 h-4 mr-2" /> Copied!</>
                ) : (
                  <><ClipboardCopy className="w-4 h-4 mr-2" /> Copy Listing</>
                )}
              </Button>
              {photos.length > 0 && (
                <Button
                  onClick={handleDownloadPhotos}
                  variant="outline"
                  className="w-full h-10 rounded-xl border-primary text-primary hover:bg-primary/5"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Photos
                </Button>
              )}
            </div>
          </Card>

          {/* Platform buttons */}
          <div className="space-y-3">
            {platforms.map((p) => (
              <Card key={p.id} className="p-3 flex items-center gap-3 bg-card border-border">
                <span className="text-2xl flex-shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.sub}</p>
                </div>
                <Button
                  onClick={() => handleCopyAndOpen(p)}
                  size="sm"
                  className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-none text-xs px-3 h-9 flex-shrink-0"
                >
                  {openedPlatforms.includes(p.id) ? "Opened ✓" : "Copy & Open →"}
                </Button>
              </Card>
            ))}
          </div>

          {/* How to post - collapsible */}
          <button
            onClick={() => setShowHow(!showHow)}
            className="flex items-center gap-2 text-sm text-muted-foreground w-full justify-center py-2"
          >
            How to post {showHow ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showHow && (
            <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground space-y-2">
              <p>1. Tap "Copy & Open" for a platform</p>
              <p>2. Paste listing text in description</p>
              <p>3. Upload photos from your camera roll</p>
              <p>4. Click Publish on that platform</p>
              <p>5. Return here and repeat for other platforms</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action */}
      <div className="p-4 border-t border-border space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={markedPosted}
            onCheckedChange={(v) => setMarkedPosted(v === true)}
          />
          <span className="text-sm text-foreground">Mark listing as posted</span>
        </label>
        <Button
          onClick={handleDone}
          disabled={!markedPosted}
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-none disabled:opacity-50"
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default PostToPlatforms;
