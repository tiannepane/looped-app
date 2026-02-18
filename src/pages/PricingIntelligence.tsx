import { useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TrendingUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import ScreenHeader from "@/components/ScreenHeader";

const mockPricingData: Record<string, {
  marketLow: number; marketHigh: number; average: number;
  recentSales: number; searches: number;
  quickPrice: number; fairPrice: number; patientPrice: number;
}> = {
  'coffee table': {
    marketLow: 150, marketHigh: 500, average: 300,
    recentSales: 23, searches: 28,
    quickPrice: 270, fairPrice: 300, patientPrice: 330,
  },
  desk: {
    marketLow: 80, marketHigh: 200, average: 125,
    recentSales: 31, searches: 42,
    quickPrice: 112, fairPrice: 125, patientPrice: 138,
  },
  laptop: {
    marketLow: 300, marketHigh: 800, average: 550,
    recentSales: 18, searches: 67,
    quickPrice: 495, fairPrice: 550, patientPrice: 605,
  },
  sofa: {
    marketLow: 250, marketHigh: 900, average: 500,
    recentSales: 27, searches: 34,
    quickPrice: 450, fairPrice: 500, patientPrice: 550,
  },
  default: {
    marketLow: 50, marketHigh: 300, average: 150,
    recentSales: 20, searches: 15,
    quickPrice: 135, fairPrice: 150, patientPrice: 165,
  },
};

const matchPricingData = (itemTitle: string) => {
  const lower = itemTitle.toLowerCase();
  if (lower.includes("coffee table") || lower.includes("table")) return mockPricingData["coffee table"];
  if (lower.includes("desk")) return mockPricingData.desk;
  if (lower.includes("laptop") || lower.includes("computer")) return mockPricingData.laptop;
  if (lower.includes("sofa") || lower.includes("couch")) return mockPricingData.sofa;
  return mockPricingData.default;
};

const getTimeline = (price: number, quick: number, fair: number, patient: number) => {
  if (price <= quick) return "1-3 days";
  if (price < fair) return "2-5 days";
  if (price === fair) return "3-7 days";
  if (price < patient) return "5-10 days";
  return "7-14 days";
};

const getContext = (price: number, quick: number, fair: number, patient: number) => {
  if (price <= quick) return "Best for urgent moves";
  if (price < fair) return "Leans towards a faster sale";
  if (price === fair) return "Balanced approach";
  if (price < patient) return "Leans towards max profit";
  return "Maximize profit";
};

const PricingIntelligence = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemTitle = "item", category = "Other" } = (location.state as { itemTitle?: string; category?: string }) || {};

  const data = useMemo(() => matchPricingData(itemTitle), [itemTitle]);
  const { quickPrice, fairPrice, patientPrice } = data;

  const [price, setPrice] = useState(fairPrice);

  const timeline = useMemo(() => getTimeline(price, quickPrice, fairPrice, patientPrice), [price, quickPrice, fairPrice, patientPrice]);
  const context = useMemo(() => getContext(price, quickPrice, fairPrice, patientPrice), [price, quickPrice, fairPrice, patientPrice]);

  const handleSliderChange = useCallback((val: number[]) => {
    // Snap to preset points within $8 range
    const v = val[0];
    if (Math.abs(v - quickPrice) < 8) setPrice(quickPrice);
    else if (Math.abs(v - fairPrice) < 8) setPrice(fairPrice);
    else if (Math.abs(v - patientPrice) < 8) setPrice(patientPrice);
    else setPrice(Math.round(v / 5) * 5);
  }, [quickPrice, fairPrice, patientPrice]);

  const searchLabel = itemTitle.length > 35 ? itemTitle.slice(0, 35) + "..." : itemTitle;

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title="Smart Pricing for Quick Sales" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5">
          {/* Market Insights */}
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Market Insights</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Similar items in Toronto sold for:</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-foreground">
                ${data.marketLow} - ${data.marketHigh}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Average price: <span className="font-semibold text-primary">${data.average}</span>
            </p>
          </Card>

          {/* Demand */}
          <Card className="p-4 bg-secondary/50 border-border">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">{data.searches} people</span> searched for "{searchLabel}" this week
              </p>
            </div>
          </Card>

          {/* Slider Section */}
          <div className="space-y-6 pt-2">
            <div className="flex justify-between text-sm font-medium text-muted-foreground px-1">
              <span>Fast Sale</span>
              <span>Max Profit</span>
            </div>

            <div className="px-1">
              <Slider
                value={[price]}
                min={quickPrice}
                max={patientPrice}
                step={1}
                onValueChange={handleSliderChange}
                className="w-full"
              />
            </div>

            {/* Marker labels */}
            <div className="flex justify-between text-center px-1">
              <div className="flex flex-col items-start">
                <span className={`text-sm font-semibold ${price === quickPrice ? "text-primary" : "text-muted-foreground"}`}>
                  ${quickPrice}
                </span>
                <span className="text-xs text-muted-foreground">1-3 days</span>
              </div>
              <div className="flex flex-col items-center">
                <span className={`text-sm font-semibold ${price === fairPrice ? "text-primary" : "text-muted-foreground"}`}>
                  ${fairPrice}
                </span>
                <span className="text-xs text-muted-foreground">3-7 days</span>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-sm font-semibold ${price === patientPrice ? "text-primary" : "text-muted-foreground"}`}>
                  ${patientPrice}
                </span>
                <span className="text-xs text-muted-foreground">7-14 days</span>
              </div>
            </div>
          </div>

          {/* Live price display */}
          <div className="text-center space-y-1 py-4">
            <p className="text-5xl font-bold text-primary">${price}</p>
            <p className="text-sm text-muted-foreground">Likely sells in {timeline}</p>
            <p className="text-xs text-muted-foreground">{context}</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={() => navigate("/platforms", { state: { itemTitle, category, price } })}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 ease-out"
        >
          Post at ${price}
        </Button>
      </div>
    </div>
  );
};

export default PricingIntelligence;
