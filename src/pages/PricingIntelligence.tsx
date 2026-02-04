import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Minus, Plus, TrendingUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ScreenHeader from "@/components/ScreenHeader";

// Dynamic pricing data based on item keywords
const getPricingData = (itemTitle: string, category: string) => {
  const lower = itemTitle.toLowerCase();
  
  const pricingMap: Record<string, { min: number; max: number; avg: number; searches: number }> = {
    chair: { min: 80, max: 150, avg: 120, searches: 18 },
    desk: { min: 120, max: 250, avg: 180, searches: 15 },
    table: { min: 150, max: 280, avg: 200, searches: 12 },
    sofa: { min: 300, max: 600, avg: 450, searches: 22 },
    couch: { min: 280, max: 550, avg: 400, searches: 20 },
    lamp: { min: 30, max: 80, avg: 55, searches: 8 },
    tv: { min: 200, max: 500, avg: 350, searches: 25 },
    phone: { min: 300, max: 700, avg: 500, searches: 45 },
    laptop: { min: 400, max: 900, avg: 650, searches: 38 },
    bike: { min: 150, max: 400, avg: 275, searches: 16 },
    camera: { min: 250, max: 600, avg: 400, searches: 12 },
    shoes: { min: 40, max: 120, avg: 75, searches: 28 },
    jacket: { min: 50, max: 150, avg: 90, searches: 14 },
    dresser: { min: 100, max: 250, avg: 175, searches: 10 },
    bed: { min: 200, max: 500, avg: 350, searches: 19 },
    bookshelf: { min: 60, max: 150, avg: 100, searches: 9 },
    iphone: { min: 400, max: 900, avg: 650, searches: 52 },
    macbook: { min: 600, max: 1200, avg: 900, searches: 35 },
    samsung: { min: 250, max: 600, avg: 400, searches: 30 },
    gaming: { min: 150, max: 350, avg: 250, searches: 24 },
    ikea: { min: 50, max: 180, avg: 120, searches: 32 },
  };

  // Find matching keyword
  for (const [keyword, data] of Object.entries(pricingMap)) {
    if (lower.includes(keyword)) {
      return {
        priceRange: { min: data.min, max: data.max },
        average: data.avg,
        searchCount: data.searches,
        searchTerm: itemTitle.length > 30 ? itemTitle.slice(0, 30) + "..." : itemTitle,
      };
    }
  }

  // Category-based fallback
  const categoryFallback: Record<string, { min: number; max: number; avg: number; searches: number }> = {
    Furniture: { min: 100, max: 300, avg: 180, searches: 15 },
    Electronics: { min: 150, max: 500, avg: 300, searches: 28 },
    Appliances: { min: 80, max: 250, avg: 150, searches: 12 },
    Clothing: { min: 30, max: 100, avg: 60, searches: 20 },
    Other: { min: 50, max: 150, avg: 100, searches: 10 },
  };

  const catData = categoryFallback[category] || categoryFallback.Other;
  return {
    priceRange: { min: catData.min, max: catData.max },
    average: catData.avg,
    searchCount: catData.searches,
    searchTerm: itemTitle.length > 30 ? itemTitle.slice(0, 30) + "..." : itemTitle,
  };
};

const PricingIntelligence = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemTitle = "item", category = "Other" } = (location.state as { itemTitle?: string; category?: string }) || {};

  const pricingData = useMemo(() => getPricingData(itemTitle, category), [itemTitle, category]);
  const [price, setPrice] = useState(pricingData.average);

  const adjustPrice = (amount: number) => {
    setPrice((prev) => Math.max(10, prev + amount));
  };

  const timeline = useMemo(() => {
    const { average } = pricingData;
    if (price <= average - 30) return "Likely sells within 1 day";
    if (price <= average - 10) return "Likely sells in 1-2 days";
    if (price <= average + 10) return "Likely sells in 2-3 days";
    if (price <= average + 30) return "Likely sells in 4-7 days";
    return "May take 1-2 weeks to sell";
  }, [price, pricingData]);

  const priceColor = useMemo(() => {
    const { average } = pricingData;
    if (price <= average - 20) return "text-success";
    if (price >= average + 20) return "text-destructive";
    return "text-primary";
  }, [price, pricingData]);

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title="Set Your Price" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5">
          {/* Market data card */}
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Market Insights</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Similar items in Toronto sold for:
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-foreground">
                ${pricingData.priceRange.min} - ${pricingData.priceRange.max}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Average price:{" "}
              <span className="font-semibold text-primary">
                ${pricingData.average}
              </span>
            </p>
          </Card>

          {/* Demand indicator */}
          <Card className="p-4 bg-secondary/50 border-border">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">{pricingData.searchCount} people</span>{" "}
                searched for "{pricingData.searchTerm}" this week
              </p>
            </div>
          </Card>

          {/* Price input */}
          <div className="py-6">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Your price
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => adjustPrice(-10)}
                className="w-14 h-14 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-colors duration-200"
              >
                <Minus className="w-6 h-6 text-foreground" />
              </button>
              <div className={`text-5xl font-bold ${priceColor} transition-colors duration-200`}>
                ${price}
              </div>
              <button
                onClick={() => adjustPrice(10)}
                className="w-14 h-14 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-colors duration-200"
              >
                <Plus className="w-6 h-6 text-foreground" />
              </button>
            </div>
          </div>

          {/* Timeline prediction */}
          <Card className="p-4 bg-muted border-border text-center">
            <p className="text-sm text-muted-foreground">At this price:</p>
            <p className="text-base font-semibold text-foreground mt-1">
              {timeline}
            </p>
          </Card>

          {/* Commission reminder */}
          <div className="bg-secondary/50 rounded-xl px-4 py-3">
            <p className="text-xs text-muted-foreground text-center">
              💰 You'll receive <span className="font-semibold text-foreground">${Math.round(price * 0.95)}</span> after Looped's 5% fee
            </p>
          </div>
        </div>
      </div>

      {/* Continue button - bright orange */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={() => navigate("/platforms", { state: { itemTitle, category, price } })}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 ease-out"
        >
          Continue to Post
        </Button>
      </div>
    </div>
  );
};

export default PricingIntelligence;
