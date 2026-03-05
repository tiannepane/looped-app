import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { User, HelpCircle, LogOut, Archive, RotateCcw, ChevronRight, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

interface UserStats {
  activeCount: number;
  soldCount: number;
  totalEarned: number;
}

interface ArchivedListing {
  id: string;
  title: string;
  price: number;
  photos: string | string[];
  status: string;
  archived_at: string;
}

type FeedbackRating = "love_it" | "its_okay" | "needs_work";
type FeedbackStep = "rating" | "message" | "thanks";

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({
    activeCount: 0,
    soldCount: 0,
    totalEarned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [archivedListings, setArchivedListings] = useState<ArchivedListing[]>([]);
  const [archivedLoading, setArchivedLoading] = useState(false);

  // Feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackStep, setFeedbackStep] = useState<FeedbackStep>("rating");
  const [feedbackRating, setFeedbackRating] = useState<FeedbackRating | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  useEffect(() => {
    fetchUserAndStats();
  }, []);

  const fetchUserAndStats = async () => {
    setLoading(true);

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const { data: listings, error } = await supabase
      .from("listings")
      .select("status, price, archived_at")
      .eq("user_id", currentUser.id);

    if (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
      return;
    }

    const activeListings = listings?.filter(
      (l) => l.status === "active" && !l.archived_at
    ) || [];

    const soldListings = listings?.filter(
      (l) => l.status === "sold" && !l.archived_at
    ) || [];

    const totalEarned = soldListings.reduce(
      (sum, listing) => sum + (listing.price || 0),
      0
    );

    setStats({
      activeCount: activeListings.length,
      soldCount: soldListings.length,
      totalEarned,
    });

    setLoading(false);
  };

  const fetchArchivedListings = async () => {
    setArchivedLoading(true);

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    const { data, error } = await supabase
      .from("listings")
      .select("id, title, price, photos, status, archived_at")
      .eq("user_id", currentUser.id)
      .not("archived_at", "is", null)
      .order("archived_at", { ascending: false });

    if (error) {
      console.error("Error fetching archived listings:", error);
    } else {
      setArchivedListings(data || []);
    }

    setArchivedLoading(false);
  };

  const handleOpenArchived = () => {
    setShowArchived(true);
    fetchArchivedListings();
  };

  const handleUnarchive = async (id: string) => {
    const { error } = await supabase
      .from("listings")
      .update({ archived_at: null })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to restore item",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Restored",
        description: "Item is back on your dashboard",
      });
      setArchivedListings((prev) => prev.filter((l) => l.id !== id));
      fetchUserAndStats();
    }
  };

  const handleOpenFeedback = () => {
    setShowFeedback(true);
    setFeedbackStep("rating");
    setFeedbackRating(null);
    setFeedbackMessage("");
  };

  const handleSelectRating = (rating: FeedbackRating) => {
    setFeedbackRating(rating);
    setFeedbackStep("message");
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackRating) return;
    setFeedbackSubmitting(true);

    const { data: { user: currentUser } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("feedback")
      .insert({
        user_id: currentUser?.id,
        rating: feedbackRating,
        message: feedbackMessage.trim() || null,
      });

    setFeedbackSubmitting(false);

    if (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to send feedback",
        variant: "destructive",
      });
    } else {
      setFeedbackStep("thanks");
    }
  };

  const handleSignOut = async () => {
    const confirmed = confirm("Are you sure you want to sign out?");
    if (!confirmed) return;

    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/login");
    }
  };

  const handleFAQ = () => {
    navigate("/faq");
  };

  const getEarnedFontSize = (amount: number) => {
    const str = `$${amount.toLocaleString()}`;
    const length = str.length;
    
    if (length <= 4) return 'text-4xl';
    if (length <= 6) return 'text-3xl';
    if (length <= 8) return 'text-2xl';
    if (length <= 10) return 'text-xl';
    return 'text-lg';
  };

  const getCountFontSize = (count: number) => {
    if (count < 100) return 'text-4xl';
    if (count < 1000) return 'text-3xl';
    if (count < 10000) return 'text-2xl';
    return 'text-xl';
  };

  const parsePhotos = (photos: string | string[]): string[] => {
    if (Array.isArray(photos)) return photos;
    if (typeof photos === "string") {
      try {
        const parsed = JSON.parse(photos);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-background">
        <header className="h-14 flex items-center justify-center px-4 bg-background border-b border-border">
          <h1 className="text-lg font-bold text-foreground">Account</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background relative">
      {/* Header */}
      <header className="h-14 flex items-center justify-center px-4 bg-background border-b border-border">
        <h1 className="text-lg font-bold text-foreground">Account</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 space-y-4">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate">
                {user?.user_metadata?.full_name || "User"}
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 border border-border flex flex-col items-center justify-center min-h-[100px]">
            <p className={`font-bold text-foreground ${getCountFontSize(stats.activeCount)}`}>
              {stats.activeCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Active</p>
          </div>

          <div className="bg-card rounded-xl p-3 border border-border flex flex-col items-center justify-center min-h-[100px]">
            <p className={`font-bold text-foreground ${getCountFontSize(stats.soldCount)}`}>
              {stats.soldCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Sold</p>
          </div>

          <div className="bg-card rounded-xl p-3 border border-border flex flex-col items-center justify-center min-h-[100px]">
            <p className={`font-bold text-primary ${getEarnedFontSize(stats.totalEarned)}`}>
              ${stats.totalEarned.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Earned</p>
          </div>
        </div>

        {/* Archived Items Button */}
        <button
          onClick={handleOpenArchived}
          className="w-full bg-card rounded-2xl p-4 border border-border flex items-center gap-4 hover:bg-accent transition-colors text-left"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <Archive className="w-6 h-6 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">Archived Items</h3>
            <p className="text-sm text-muted-foreground">
              View and restore removed listings
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </button>

        {/* Feedback Button */}
        <button
          onClick={handleOpenFeedback}
          className="w-full bg-card rounded-2xl p-4 border border-border flex items-center gap-4 hover:bg-accent transition-colors text-left"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Tell us what you think
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </button>

        {/* FAQ Button */}
        <button
          onClick={handleFAQ}
          className="w-full bg-card rounded-2xl p-4 border border-border flex items-center gap-4 hover:bg-accent transition-colors text-left"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">FAQ</h3>
            <p className="text-sm text-muted-foreground">
              Common questions answered
            </p>
          </div>
        </button>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full bg-card rounded-2xl p-4 border border-border flex items-center gap-4 hover:bg-destructive/10 transition-colors text-left"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <LogOut className="w-6 h-6 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-destructive">Sign Out</h3>
            <p className="text-sm text-muted-foreground">
              Log out of your account
            </p>
          </div>
        </button>
      </div>

      {/* Archived Items Overlay */}
      {showArchived && (
        <div className="absolute inset-0 z-50 flex flex-col bg-background">
          <header className="h-14 flex items-center justify-between px-4 bg-background border-b border-border">
            <button onClick={() => setShowArchived(false)}>
              <X className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-bold text-foreground">Archived Items</h1>
            <div className="w-5" />
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {archivedLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : archivedListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Archive className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No archived items</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Items you remove from your dashboard will appear here
                </p>
              </div>
            ) : (
              archivedListings.map((listing) => {
                const photosArray = parsePhotos(listing.photos);
                const firstPhoto = photosArray.length > 0
                  ? photosArray[0]
                  : "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop";

                return (
                  <div
                    key={listing.id}
                    className="bg-card rounded-2xl p-4 border border-border"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={firstPhoto}
                          alt={listing.title}
                          className="w-full h-full object-cover grayscale opacity-60"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {listing.title}
                        </h3>
                        <p className="text-lg font-bold text-primary">
                          ${listing.price}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Archived {getDaysAgo(listing.archived_at)} days ago
                        </p>
                        <Button
                          onClick={() => handleUnarchive(listing.id)}
                          size="sm"
                          variant="outline"
                          className="text-xs h-8 gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Restore
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Feedback Overlay */}
      {showFeedback && (
        <div className="absolute inset-0 z-50 flex flex-col bg-background">
          <header className="h-14 flex items-center justify-between px-4 bg-background border-b border-border">
            <button onClick={() => setShowFeedback(false)}>
              <X className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-bold text-foreground">Feedback</h1>
            <div className="w-5" />
          </header>

          <div className="flex-1 flex flex-col items-center justify-center p-6">
            {/* Step 1: Rating */}
            {feedbackStep === "rating" && (
              <div className="flex flex-col items-center text-center">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  How's your experience?
                </h2>
                <p className="text-sm text-muted-foreground mb-10">
                  Tap to let us know
                </p>
                <div className="flex gap-8">
                  <button
                    onClick={() => handleSelectRating("love_it")}
                    className="flex flex-col items-center gap-2 transition-transform hover:scale-110 active:scale-95"
                  >
                    <span className="text-6xl">😍</span>
                    <span className="text-xs font-medium text-muted-foreground">Love it</span>
                  </button>
                  <button
                    onClick={() => handleSelectRating("its_okay")}
                    className="flex flex-col items-center gap-2 transition-transform hover:scale-110 active:scale-95"
                  >
                    <span className="text-6xl">🙂</span>
                    <span className="text-xs font-medium text-muted-foreground">It's okay</span>
                  </button>
                  <button
                    onClick={() => handleSelectRating("needs_work")}
                    className="flex flex-col items-center gap-2 transition-transform hover:scale-110 active:scale-95"
                  >
                    <span className="text-6xl">😔</span>
                    <span className="text-xs font-medium text-muted-foreground">Needs work</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Optional Message */}
            {feedbackStep === "message" && (
              <div className="flex flex-col items-center text-center w-full">
                <span className="text-5xl mb-4">
                  {feedbackRating === "love_it" && "😍"}
                  {feedbackRating === "its_okay" && "🙂"}
                  {feedbackRating === "needs_work" && "😔"}
                </span>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Want to tell us more?
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  We'd love to hear your thoughts! 
                </p>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="What's on your mind..."
                  className="w-full h-32 p-4 rounded-xl border border-border bg-card text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-2 self-end">
                  {feedbackMessage.length}/500
                </p>
                <div className="flex gap-3 mt-6 w-full">
                  <Button
                    onClick={handleSubmitFeedback}
                    variant="outline"
                    className="flex-1 rounded-xl"
                    disabled={feedbackSubmitting}
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={handleSubmitFeedback}
                    className="flex-1 rounded-xl"
                    disabled={feedbackSubmitting}
                  >
                    {feedbackSubmitting ? "Sending..." : "Submit"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Thank You */}
            {feedbackStep === "thanks" && (
              <div className="flex flex-col items-center text-center">
                <span className="text-6xl mb-6">🙏</span>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Thank you!
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Your feedback helps us make Looped better for everyone.
                </p>
                <Button
                  onClick={() => setShowFeedback(false)}
                  className="rounded-xl px-8"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Account;