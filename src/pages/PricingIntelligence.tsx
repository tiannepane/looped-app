import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, TrendingUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ScreenHeader from "@/components/ScreenHeader";
import { pricingSuggestions } from "@/lib/fakeData";

const PricingIntelligence = () => {
  const navigate = useNavigate();
  const [price, setPrice] = useState(pricingSuggestions.average);

  const adjustPrice = (amount: number) => {
    setPrice((prev) => Math.max(10, prev + amount));
  };

  const timeline = useMemo(() => {
    const { average } = pricingSuggestions;
    if (price <= average - 30) return "Likely sells within 1 day";
    if (price <= average - 10) return "Likely sells in 1-2 days";
    if (price <= average + 10) return "Likely sells in 2-3 days";
    if (price <= average + 30) return "Likely sells in 4-7 days";
    return "May take 1-2 weeks to sell";
  }, [price]);

  const priceColor = useMemo(() => {
    const { average } = pricingSuggestions;
    if (price <= average - 20) return "text-success";
    if (price >= average + 20) return "text-destructive";
    return "text-primary";
  }, [price]);

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
              Similar items in {pricingSuggestions.location} sold for:
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-foreground">
                ${pricingSuggestions.priceRange.min} - ${pricingSuggestions.priceRange.max}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Average price:{" "}
              <span className="font-semibold text-primary">
                ${pricingSuggestions.average}
              </span>
            </p>
          </Card>

          {/* Demand indicator */}
          <Card className="p-4 bg-secondary/50 border-border">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">{pricingSuggestions.searchCount} people</span>{" "}
                searched for "{pricingSuggestions.searchTerm}" this week
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
        </div>
      </div>

      {/* Continue button */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={() => navigate("/platforms")}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-300 ease-out"
        >
          Continue to Post
        </Button>
      </div>
    </div>
  );
};

export default PricingIntelligence;
