import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Trash2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Toaster } from "@/components/ui/toaster";

type TabType = "active" | "all";

interface Listing {
  id: string;
  title: string;
  price: number;
  photos: string | string[];
  status: string;
  created_at: string;
  sold_at: string | null;
  deleted_at: string | null;
  category: string;
  postal_code: string;
  days_to_sell: number | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("active");

  useEffect(() => {
    fetchListings();
  }, [activeTab]);

  const fetchListings = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/login");
      return;
    }

    let query = supabase
      .from("listings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (activeTab === "active") {
      query = query.eq("status", "active").is("deleted_at", null);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching listings:", error);
      toast({
        title: "Error",
        description: "Failed to load your items",
        variant: "destructive",
      });
    } else {
      setListings(data || []);
    }

    setLoading(false);
  };

  // Fun congratulatory messages with variety
  const getCongratulationsMessage = (daysToSell: number, price: number) => {
    const messages = [
      `🎉 Awesome! Sold in ${daysToSell} ${daysToSell === 1 ? 'day' : 'days'} for $${price}!`,
      `💰 Nice! That's $${price} in your pocket after ${daysToSell} ${daysToSell === 1 ? 'day' : 'days'}!`,
      `⚡ Boom! Sold in just ${daysToSell} ${daysToSell === 1 ? 'day' : 'days'}!`,
      `🔥 Great job! Your item sold in ${daysToSell} ${daysToSell === 1 ? 'day' : 'days'}!`,
      `✨ Success! Sold for $${price} in ${daysToSell} ${daysToSell === 1 ? 'day' : 'days'}!`,
    ];
    
    // Randomly select a message
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleMarkAsSold = async (id: string, listing: Listing) => {
    // Calculate days to sell
    const createdDate = new Date(listing.created_at);
    const soldDate = new Date();
    const diffTime = soldDate.getTime() - createdDate.getTime();
    const daysToSell = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const { error } = await supabase
      .from("listings")
      .update({ 
        status: "sold",
        sold_at: soldDate.toISOString(),
        days_to_sell: daysToSell
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark as sold",
        variant: "destructive",
      });
    } else {
      // Show fun congratulations message
      toast({
        title: "Sold!",
        description: getCongratulationsMessage(daysToSell, listing.price),
      });
      
      // Trigger pricing data update in background
      updatePricingIntelligence(listing, daysToSell);
      
      fetchListings();
    }
  };

  const updatePricingIntelligence = async (listing: Listing, daysToSell: number) => {
    try {
      // Extract postal code prefix (first 3 characters)
      const postalPrefix = listing.postal_code.substring(0, 3).toUpperCase();
      
      // Try to find existing pricing data (exact match, then fallback to area)
      let existingPricing = null;
      
      // Try exact postal code prefix match first
      const { data: exactMatch } = await supabase
        .from("pricing_data")
        .select("*")
        .eq("category", listing.category)
        .eq("postal_code_prefix", postalPrefix)
        .maybeSingle();

      if (exactMatch) {
        existingPricing = exactMatch;
      } else {
        // Try area match (first 2 chars, e.g., M8 for M8H)
        const areaPrefix = postalPrefix.substring(0, 2);
        const { data: areaMatch } = await supabase
          .from("pricing_data")
          .select("*")
          .eq("category", listing.category)
          .like("postal_code_prefix", `${areaPrefix}%`)
          .order("confidence_score", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (areaMatch) {
          existingPricing = areaMatch;
        }
      }

      if (existingPricing) {
        // Update existing pricing data
        const totalSamples = existingPricing.sample_count + 1;
        const newAvgPrice = Math.round(
          (existingPricing.avg_price * existingPricing.sample_count + listing.price) / totalSamples
        );
        const currentAvgDays = existingPricing.avg_days_to_sell || 5;
        const newAvgDays = Math.round(
          (currentAvgDays * existingPricing.sample_count + daysToSell) / totalSamples
        );
        
        // Increase confidence score (max 99)
        const newConfidence = Math.min(99, existingPricing.confidence_score + 1);

        await supabase
          .from("pricing_data")
          .update({
            avg_price: newAvgPrice,
            min_price: Math.min(existingPricing.min_price, listing.price),
            max_price: Math.max(existingPricing.max_price, listing.price),
            sample_count: totalSamples,
            avg_days_to_sell: newAvgDays,
            confidence_score: newConfidence,
            data_source: 'user_sales',
            last_updated: new Date().toISOString()
          })
          .eq("id", existingPricing.id);

        console.log(`✅ Updated pricing: ${listing.category} in ${postalPrefix} (${totalSamples} samples, confidence ${newConfidence})`);
      } else {
        // Create new pricing entry
        await supabase
          .from("pricing_data")
          .insert({
            category: listing.category,
            subcategory: 'General',
            postal_code_prefix: postalPrefix,
            avg_price: listing.price,
            min_price: listing.price,
            max_price: listing.price,
            sample_count: 1,
            avg_days_to_sell: daysToSell,
            confidence_score: 75,
            data_source: 'user_sales'
          });

        console.log(`✅ New pricing entry: ${listing.category} in ${postalPrefix}`);
      }
    } catch (error) {
      console.error('Error updating pricing intelligence:', error);
      // Silently fail - don't interrupt user experience
    }
  };

  const handleDelete = async (id: string, listing: Listing) => {
    const isSold = listing.status === "sold";
    
    const confirmMessage = isSold 
      ? "Delete this sold item? Your earnings will stay in your account stats."
      : "Delete this listing?";
    
    if (!confirm(confirmMessage)) return;

    const { error } = await supabase
      .from("listings")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Item deleted",
      });
      fetchListings();
    }
  };

  const getListingStatus = (listing: Listing) => {
    if (listing.deleted_at) return "deleted";
    if (listing.status === "sold") return "sold";
    return "active";
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const parsePhotos = (photos: string | string[]): string[] => {
    if (Array.isArray(photos)) {
      return photos;
    }
    
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

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-background">
        <header className="h-14 flex items-center justify-center px-4 bg-background border-b border-border">
          <h1 className="text-lg font-bold text-foreground">My Items</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <BottomNav />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background relative">
      <header className="h-14 flex items-center justify-center px-4 bg-background border-b border-border">
        <h1 className="text-lg font-bold text-foreground">My Items</h1>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border bg-background sticky top-0 z-10">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "active"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
        >
          All
        </button>
      </div>

      {/* Listings */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <p className="text-muted-foreground mb-4">
              {activeTab === "active" 
                ? "No active listings yet"
                : "No listings yet"}
            </p>
            <Button
              onClick={() => navigate("/photo")}
              size="lg"
              className="rounded-2xl"
            >
              Create a Listing
            </Button>
          </div>
        ) : (
          listings.map((listing) => {
            const status = getListingStatus(listing);
            const photosArray = parsePhotos(listing.photos);
            const firstPhoto = photosArray && photosArray.length > 0
              ? photosArray[0]
              : "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop";

            return (
              <div
                key={listing.id}
                className="bg-card rounded-2xl p-4 border border-border"
              >
                <div className="flex gap-3">
                  {/* Photo */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={firstPhoto}
                      alt={listing.title}
                      className={`w-full h-full object-cover ${
                        status !== "active" ? "grayscale opacity-60" : ""
                      }`}
                    />
                    {status === "active" && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                    )}
                    {status === "sold" && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                    {status === "deleted" && (
                      <div className="absolute top-2 right-2">
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {listing.title}
                      </h3>
                      {status === "active" && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full flex-shrink-0">
                          Active
                        </span>
                      )}
                      {status === "sold" && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full flex-shrink-0">
                          SOLD
                        </span>
                      )}
                      {status === "deleted" && (
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded-full flex-shrink-0">
                          DELETED
                        </span>
                      )}
                    </div>

                    <p className="text-2xl font-bold text-primary mb-1">
                      ${listing.price}
                    </p>

                    <p className="text-xs text-muted-foreground mb-2">
                      {status === "active" && (
                        <>Posted {getDaysAgo(listing.created_at)} days ago</>
                      )}
                      {status === "sold" && listing.sold_at && (
                        <>
                          Sold {getDaysAgo(listing.sold_at)} days ago
                          {listing.days_to_sell && (
                            <> • Took {listing.days_to_sell} {listing.days_to_sell === 1 ? 'day' : 'days'}</>
                          )}
                        </>
                      )}
                      {status === "deleted" && listing.deleted_at && (
                        <>Deleted {getDaysAgo(listing.deleted_at)} days ago</>
                      )}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {status === "active" && (
                        <>
                          <Button
                            onClick={() => handleMarkAsSold(listing.id, listing)}
                            size="sm"
                            variant="outline"
                            className="text-xs h-8"
                          >
                            Mark as Sold
                          </Button>
                          <Button
                            onClick={() => handleDelete(listing.id, listing)}
                            size="sm"
                            variant="ghost"
                            className="text-xs h-8 text-destructive"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                      {status === "sold" && !listing.deleted_at && (
                        <Button
                          onClick={() => handleDelete(listing.id, listing)}
                          size="sm"
                          variant="ghost"
                          className="text-xs h-8 text-destructive"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
      
      {/* Toast container */}
      <Toaster />
    </div>
  );
};

export default Dashboard;