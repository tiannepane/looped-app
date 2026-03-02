import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { User, HelpCircle, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";

interface UserStats {
  activeCount: number;
  soldCount: number;
  totalEarned: number;
}

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
      .select("status, price, deleted_at")
      .eq("user_id", currentUser.id);

    if (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
      return;
    }

    const activeListings = listings?.filter(
      (l) => l.status === "active" && !l.deleted_at
    ) || [];

    const soldListings = listings?.filter(
      (l) => l.status === "sold" && !l.deleted_at
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

  // Dynamic font size calculation
  const getEarnedFontSize = (amount: number) => {
    const str = `$${amount.toLocaleString()}`;
    const length = str.length;
    
    if (length <= 4) return 'text-4xl'; // $999
    if (length <= 6) return 'text-3xl'; // $9,999
    if (length <= 8) return 'text-2xl'; // $99,999
    if (length <= 10) return 'text-xl'; // $999,999
    return 'text-lg'; // $1,000,000+
  };

  const getCountFontSize = (count: number) => {
    if (count < 100) return 'text-4xl';
    if (count < 1000) return 'text-3xl';
    if (count < 10000) return 'text-2xl';
    return 'text-xl';
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
    <div className="h-full flex flex-col bg-background">
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

        {/* Stats Grid - ACTUALLY Dynamic */}
        <div className="grid grid-cols-3 gap-3">
          {/* Active Listings */}
          <div className="bg-card rounded-xl p-3 border border-border flex flex-col items-center justify-center min-h-[100px]">
            <p className={`font-bold text-foreground ${getCountFontSize(stats.activeCount)}`}>
              {stats.activeCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Active</p>
          </div>

          {/* Sold Listings */}
          <div className="bg-card rounded-xl p-3 border border-border flex flex-col items-center justify-center min-h-[100px]">
            <p className={`font-bold text-foreground ${getCountFontSize(stats.soldCount)}`}>
              {stats.soldCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Sold</p>
          </div>

          {/* Total Earned */}
          <div className="bg-card rounded-xl p-3 border border-border flex flex-col items-center justify-center min-h-[100px]">
            <p className={`font-bold text-primary ${getEarnedFontSize(stats.totalEarned)}`}>
              ${stats.totalEarned.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Earned</p>
          </div>
        </div>

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

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Account;