import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, MessageCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import { fakeListings, ListingItem } from "@/lib/fakeData";

// Map categories to placeholder images
const getCategoryImage = (category: string): string => {
  const imageMap: Record<string, string> = {
    Furniture: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    Electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
    Appliances: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop",
    Clothing: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop",
    Other: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
  };
  return imageMap[category] || imageMap.Other;
};

interface NewListingState {
  itemTitle: string;
  category: string;
  price: number;
  platforms: string[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [listings, setListings] = useState<ListingItem[]>(fakeListings);

  // Check for newly added listing or sold item from navigation state
  useEffect(() => {
    const state = location.state as { 
      newListing?: NewListingState; 
      soldItem?: { id: string; soldPrice: number } 
    } | null;
    
    if (state?.newListing) {
      const { itemTitle, category, price, platforms } = state.newListing;
      
      // Create new listing item
      const newItem: ListingItem = {
        id: `new-${Date.now()}`,
        title: itemTitle,
        price: price,
        image: getCategoryImage(category),
        category: category,
        condition: "Like New",
        description: "",
        messageCount: 0,
        postedDaysAgo: 0,
        platforms: platforms,
      };

      // Add to top of listings (avoid duplicates on re-render)
      setListings((prev) => {
        if (prev.some((l) => l.id === newItem.id)) return prev;
        return [newItem, ...prev];
      });

      // Clear the state to prevent re-adding on navigation
      window.history.replaceState({}, document.title);
    }
    
    if (state?.soldItem) {
      const { id, soldPrice } = state.soldItem;
      setListings((prev) => 
        prev.map((l) => 
          l.id === id ? { ...l, isSold: true, soldPrice } : l
        )
      );
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Store listings in sessionStorage for the inbox to access
  const handleCardClick = (listing: ListingItem) => {
    sessionStorage.setItem("currentListing", JSON.stringify(listing));
    navigate(`/inbox/${listing.id}`);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 bg-background border-b border-border">
        <h1 className="text-lg font-bold text-foreground">Your Items</h1>
        <button
          onClick={() => navigate("/photo")}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-3">
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items listed yet.</p>
              <button
                onClick={() => navigate("/photo")}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Start selling your first item
              </button>
            </div>
          ) : (
            listings.map((listing, index) => (
              <Card
                key={listing.id}
                onClick={() => handleCardClick(listing)}
                className={`p-3 flex gap-3 bg-card border-border cursor-pointer hover:shadow-md transition-all duration-200 ease-out hover:scale-[1.01] ${
                  index === 0 && listing.postedDaysAgo === 0 && !listing.isSold ? "ring-2 ring-primary/50" : ""
                } ${listing.isSold ? "opacity-75" : ""}`}
              >
                <div className="relative">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className={`w-20 h-20 rounded-xl object-cover flex-shrink-0 ${listing.isSold ? "grayscale" : ""}`}
                  />
                  {listing.isSold && (
                    <div className="absolute inset-0 bg-success/20 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-success" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">
                      {listing.title}
                    </h3>
                    {listing.isSold ? (
                      <span className="text-[10px] font-medium bg-success/10 text-success px-1.5 py-0.5 rounded-full flex-shrink-0">
                        SOLD
                      </span>
                    ) : listing.postedDaysAgo === 0 ? (
                      <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex-shrink-0">
                        NEW
                      </span>
                    ) : null}
                  </div>
                  {listing.isSold && listing.soldPrice ? (
                    <div className="mt-1">
                      <p className="text-success font-bold">Sold for: ${listing.soldPrice}</p>
                    </div>
                  ) : (
                    <p className="text-primary font-bold">${listing.price}</p>
                  )}
                  {!listing.isSold && (
                    <div className="flex items-center gap-3 mt-2">
                      {listing.messageCount > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{listing.messageCount} messages</span>
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {listing.postedDaysAgo === 0 
                          ? "Just posted" 
                          : `Posted ${listing.postedDaysAgo} day${listing.postedDaysAgo !== 1 ? "s" : ""} ago`}
                      </span>
                    </div>
                  )}
                  {/* Platform badges */}
                  <div className="flex gap-1 mt-2">
                    {listing.platforms.includes("facebook") && (
                      <span className="text-xs">📘</span>
                    )}
                    {listing.platforms.includes("kijiji") && (
                      <span className="text-xs">🟣</span>
                    )}
                    {listing.platforms.includes("carrot") && (
                      <span className="text-xs">🥕</span>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
