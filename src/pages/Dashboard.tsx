import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import { fakeListings, ListingItem } from "@/lib/fakeData";

const Dashboard = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingItem[]>(fakeListings);

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
            listings.map((listing) => (
              <Card
                key={listing.id}
                onClick={() => handleCardClick(listing)}
                className="p-3 flex gap-3 bg-card border-border cursor-pointer hover:shadow-md transition-all duration-200 ease-out hover:scale-[1.01]"
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {listing.title}
                  </h3>
                  <p className="text-primary font-bold">${listing.price}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {listing.messageCount > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{listing.messageCount} messages</span>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Posted {listing.postedDaysAgo} day
                      {listing.postedDaysAgo !== 1 && "s"} ago
                    </span>
                  </div>
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
