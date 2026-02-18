import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import BottomNav from "@/components/BottomNav";
import { fakeListings, ListingItem } from "@/lib/fakeData";

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
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [showSoldConfirm, setShowSoldConfirm] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    const state = location.state as { newListing?: NewListingState } | null;
    if (state?.newListing) {
      const { itemTitle, category, price, platforms } = state.newListing;
      const newItem: ListingItem = {
        id: `new-${Date.now()}`,
        title: itemTitle,
        price,
        image: getCategoryImage(category),
        category,
        condition: "Like New",
        description: "",
        messageCount: 0,
        postedDaysAgo: 0,
        platforms,
      };
      setListings((prev) => {
        if (prev.some((l) => l.id === newItem.id)) return prev;
        return [newItem, ...prev];
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleCardClick = (listing: ListingItem) => {
    setSelectedListing(listing);
    setShowActions(true);
  };

  const handleMarkAsSold = () => {
    if (!selectedListing) return;
    setShowSoldConfirm(false);
    setListings((prev) =>
      prev.map((l) =>
        l.id === selectedListing.id ? { ...l, isSold: true, soldPrice: l.price } : l
      )
    );
    setShowCongrats(true);
  };

  const handleDelete = () => {
    if (!selectedListing) return;
    setShowActions(false);
    setListings((prev) => prev.filter((l) => l.id !== selectedListing.id));
    setSelectedListing(null);
  };

  return (
    <div className="h-full flex flex-col bg-background">
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
                    <div className="absolute inset-0 bg-secondary/40 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">{listing.title}</h3>
                    {listing.isSold ? (
                      <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full flex-shrink-0">
                        SOLD
                      </span>
                    ) : listing.postedDaysAgo === 0 ? (
                      <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex-shrink-0">
                        NEW
                      </span>
                    ) : null}
                  </div>
                  <p className="text-primary font-bold">${listing.price}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {listing.isSold ? (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Sold</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-xs text-muted-foreground">Active</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {listing.postedDaysAgo === 0
                            ? "Just posted"
                            : `Posted ${listing.postedDaysAgo} day${listing.postedDaysAgo !== 1 ? "s" : ""} ago`}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-1 mt-1.5">
                    {listing.platforms.includes("facebook") && <span className="text-xs">📘</span>}
                    {listing.platforms.includes("kijiji") && <span className="text-xs">🟣</span>}
                    {listing.platforms.includes("carrot") && <span className="text-xs">🥕</span>}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNav />

      {/* Action modal */}
      <AlertDialog open={showActions} onOpenChange={setShowActions}>
        <AlertDialogContent className="max-w-[300px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">{selectedListing?.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-primary font-bold text-base">
              ${selectedListing?.price}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 pt-2">
            {!selectedListing?.isSold && (
              <Button
                onClick={() => {
                  setShowActions(false);
                  setShowSoldConfirm(true);
                }}
                className="w-full h-12 rounded-xl"
              >
                Mark as Sold
              </Button>
            )}
            <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => setShowActions(false)}>
              Edit Listing
            </Button>
            <Button
              variant="ghost"
              className="w-full h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
          <AlertDialogFooter className="pt-0">
            <AlertDialogCancel className="w-full rounded-xl">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sold confirmation */}
      <AlertDialog open={showSoldConfirm} onOpenChange={setShowSoldConfirm}>
        <AlertDialogContent className="max-w-[300px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Sold?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{selectedListing?.title}" from all platforms.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleMarkAsSold} className="rounded-xl">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Congrats modal */}
      <AlertDialog open={showCongrats} onOpenChange={setShowCongrats}>
        <AlertDialogContent className="max-w-[300px] rounded-2xl text-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Congrats! 🎉</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="text-primary font-bold text-lg">Sold for ${selectedListing?.price}</p>
              <p className="text-sm text-muted-foreground">
                This listing has been removed from all platforms
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              onClick={() => {
                setShowCongrats(false);
                setSelectedListing(null);
              }}
              className="w-full rounded-xl"
            >
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
