import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, ChevronDown, ChevronUp, ClipboardCopy, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import ScreenHeader from "@/components/ScreenHeader";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const platforms = [
  {
    id: "facebook",
    name: "Facebook Marketplace",
    sub: "Largest audience",
    icon: (
      <div className="w-9 h-9 rounded-lg bg-[#1877F2] flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </div>
    ),
    deepLink: "fb://marketplace/create",
    webUrl: "https://m.facebook.com/marketplace/create",
    appStoreUrl: "https://apps.apple.com/app/facebook/id284882215",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.facebook.katana",
  },
  {
    id: "kijiji",
    name: "Kijiji",
    sub: "Popular for local pickup",
    icon: (
      <div className="w-9 h-9 rounded-lg bg-[#7B68EE] flex items-center justify-center">
        <span className="text-white font-bold text-lg">K</span>
      </div>
    ),
    deepLink: "kijiji://post",
    webUrl: "https://kijiji.ca/p-post-ad.html",
    appStoreUrl: "https://apps.apple.com/app/kijiji-buy-sell-save/id677523465",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.ebay.kijiji.ca",
  },
  {
    id: "karrot",
    name: "Karrot",
    sub: "Best for neighborhoods",
    icon: (
      <div className="w-9 h-9 rounded-lg bg-[#FF6F0F] flex items-center justify-center">
        <span className="text-2xl">🥕</span>
      </div>
    ),
    deepLink: "karrot://post",
    webUrl: "https://ca.karrotmarket.com/create",
    appStoreUrl: "https://apps.apple.com/app/karrot-buy-sell-locally/id1018769995",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.towneers.www",
  },
];

const PostToPlatforms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const {
    photos = [],
    title = "Your Item",
    category = "Other",
    price = 100,
    location: itemLocation = "",
    description = "",
    condition = "Good",
    postalCode = "",
    size = "",
  } = (location.state as Record<string, any>) || {};

  const [copied, setCopied] = useState(false);
  const [showHow, setShowHow] = useState(false);
  const [markedPosted, setMarkedPosted] = useState(false);
  const [openedPlatforms, setOpenedPlatforms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tipCount, setTipCount] = useState(0);

  useEffect(() => {
    const count = parseInt(localStorage.getItem("looped_platform_tip_count") || "0");
    setTipCount(count);
    if (count < 5) {
      setShowOnboarding(true);
    }
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    const newCount = tipCount + 1;
    setTipCount(newCount);
    localStorage.setItem("looped_platform_tip_count", String(newCount));
  };

  const isFirstVisit = tipCount === 0;

  const listingText = [
    `${title} - $${price}`,
    description || "",
    `📍 ${itemLocation || postalCode}`,
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

  const tryDeepLink = (platform: typeof platforms[0]) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) {
      window.open(platform.webUrl, "_blank");
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = platform.deepLink;
    document.body.appendChild(iframe);

    setTimeout(() => {
      document.body.removeChild(iframe);
      if (!document.hidden) {
        window.open(platform.webUrl, "_blank");
      }
    }, 1500);
  };

  const handleCopyAndOpen = async (platform: typeof platforms[0]) => {
    try {
      await navigator.clipboard.writeText(listingText);
      toast({ title: `✓ Copied! Opening ${platform.name}...` });
      setOpenedPlatforms((p) => [...new Set([...p, platform.id])]);

      setTimeout(() => {
        tryDeepLink(platform);
      }, 500);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleDownloadPhotos = async () => {
    if (downloading) return;
    
    setDownloading(true);
    
    try {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        
        const response = await fetch(photo);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${title.replace(/\s+/g, "-")}-${i + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(blobUrl);
        
        if (i < photos.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      toast({ title: "📥 Photos downloaded!" });
    } catch (error) {
      console.error('Download error:', error);
      toast({ 
        title: "Download failed", 
        description: "Please try again",
        variant: "destructive" 
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleDone = async () => {
    if (hasSubmitted) {
      toast({
        title: "Already submitted",
        description: "This listing has been saved. Redirecting...",
      });
      navigate("/dashboard", { replace: true });
      return;
    }

    if (saving) return;
    
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a listing",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const { data: existingListings } = await supabase
        .from('listings')
        .select('id')
        .eq('user_id', user.id)
        .eq('title', title)
        .eq('price', Number(price))
        .eq('status', 'active')
        .is('archived_at', null);

      if (existingListings && existingListings.length > 0) {
        toast({
          title: "Listing already exists",
          description: "You've already posted this item.",
          variant: "destructive",
        });
        setSaving(false);
        setHasSubmitted(true);
        navigate("/dashboard", { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          title: title,
          description: description || "",
          price: Number(price),
          postal_code: postalCode || itemLocation || "",
          condition: condition,
          category: category,
          photos: photos,
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving listing:', error);
        toast({
          title: "Error",
          description: "Failed to save listing. Please try again.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      setHasSubmitted(true);

      toast({
        title: "Success!",
        description: "Your listing has been saved",
      });

      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background relative">
      <ScreenHeader title="Post to Platforms" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <Card className="p-3 bg-card border-border">
            <div className="flex gap-3 mb-3">
              {photos.length > 0 ? (
                <img src={photos[0]} alt="Item" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center text-3xl flex-shrink-0">📦</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{title}</h3>
                <p className="text-primary font-bold">${price}</p>
                {(itemLocation || postalCode) && <p className="text-xs text-muted-foreground">📍 {itemLocation || postalCode}</p>}
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-3 mb-3">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{listingText}</pre>
            </div>

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
                  disabled={downloading}
                  variant="outline"
                  className="w-full h-10 rounded-xl border-primary text-primary hover:bg-primary/5 disabled:opacity-50"
                >
                  <Download className="w-4 h-4 mr-2" /> 
                  {downloading ? "Downloading..." : "Download Photos"}
                </Button>
              )}
            </div>
          </Card>

          <div className="space-y-3">
            {platforms.map((p) => (
              <Card key={p.id} className="p-3 flex items-center gap-3 bg-card border-border">
                <div className="flex-shrink-0">{p.icon}</div>
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

      <div className="p-4 border-t border-border space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={markedPosted}
            onCheckedChange={(v) => setMarkedPosted(v === true)}
          />
          <span className="text-sm text-foreground">I've posted to the platforms</span>
        </label>
        <Button
          onClick={handleDone}
          disabled={!markedPosted || saving || hasSubmitted}
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-none disabled:opacity-50"
        >
          {saving ? "Saving..." : hasSubmitted ? "Already Saved" : "Done"}
        </Button>
      </div>

      {/* Onboarding Bottom Sheet */}
      {showOnboarding && (
        <>
          <div
            className="absolute inset-0 bg-black/40 z-40"
            onClick={dismissOnboarding}
          />
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {isFirstVisit ? "Quick tip" : "Reminder"}
              </h3>
              <button onClick={dismissOnboarding}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {isFirstVisit ? (
              <>
                <p className="text-sm text-muted-foreground mb-5">
                  For the fastest posting, make sure you have these apps installed and logged in. We'll open them directly so you can paste and post!
                </p>
                <div className="space-y-3 mb-6">
                  {platforms.map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0">{p.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                      </div>
                      <span className="text-xs text-green-600 font-medium"></span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={dismissOnboarding}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-none"
                >
                  Got it, let's go!
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-5">
                  Make sure you're logged into these apps for the fastest posting experience.
                </p>
                <div className="flex items-center gap-4 mb-6 justify-center">
                  {platforms.map((p) => (
                    <div key={p.id} className="flex-shrink-0">
                      {p.icon}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={dismissOnboarding}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-none"
                >
                  Got it
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostToPlatforms;