import { useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import ScreenHeader from "@/components/ScreenHeader";

const mockPricingData: Record<string, {
  marketLow: number; marketHigh: number; average: number;
  searches: number;
  quickPrice: number; fairPrice: number; patientPrice: number;
}> = {
  'coffee table': { marketLow: 150, marketHigh: 500, average: 300, searches: 28, quickPrice: 270, fairPrice: 300, patientPrice: 330 },
  desk: { marketLow: 80, marketHigh: 200, average: 125, searches: 42, quickPrice: 112, fairPrice: 125, patientPrice: 138 },
  laptop: { marketLow: 300, marketHigh: 800, average: 550, searches: 67, quickPrice: 495, fairPrice: 550, patientPrice: 605 },
  sofa: { marketLow: 250, marketHigh: 900, average: 500, searches: 34, quickPrice: 450, fairPrice: 500, patientPrice: 550 },
  default: { marketLow: 50, marketHigh: 300, average: 150, searches: 15, quickPrice: 135, fairPrice: 150, patientPrice: 165 },
};

const matchPricingData = (itemTitle: string) => {
  const lower = itemTitle.toLowerCase();
  if (lower.includes("coffee table") || lower.includes("table")) return mockPricingData["coffee table"];
  if (lower.includes("desk")) return mockPricingData.desk;
  if (lower.includes("laptop") || lower.includes("computer")) return mockPricingData.laptop;
  if (lower.includes("sofa") || lower.includes("couch")) return mockPricingData.sofa;
  return mockPricingData.default;
};

const getPriceZone = (price: number, quick: number, patient: number) => {
  const greenThreshold = quick + (patient - quick) * 0.1;
  if (price <= greenThreshold) return "green";
  if (price <= patient) return "orange";
  return "red";
};

const getTimeline = (price: number, quick: number, fair: number, patient: number) => {
  if (price <= quick) return "1-3 days";
  const greenThreshold = quick + (patient - quick) * 0.1;
  if (price <= greenThreshold) return "1-3 days";
  if (price <= fair) return "3-7 days";
  if (price <= patient) return "5-10 days";
  return "10-14+ days";
};

const priceColorMap = { green: "#10B981", orange: "#F59E0B", red: "#EF4444" };

const PricingIntelligence = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const {
    photos = [],
    itemTitle = "item",
    category = "Other",
    location: itemLocation = "",
    description = "",
    isMovingSale = false,
    movingDate = null,
  } = (loc.state as Record<string, any>) || {};

  const data = useMemo(() => matchPricingData(itemTitle), [itemTitle]);
  const { quickPrice, fairPrice, patientPrice } = data;

  const [price, setPrice] = useState(fairPrice);

  const zone = useMemo(() => getPriceZone(price, quickPrice, patientPrice), [price, quickPrice, patientPrice]);
  const timeline = useMemo(() => getTimeline(price, quickPrice, fairPrice, patientPrice), [price, quickPrice, fairPrice, patientPrice]);

  const handleSliderChange = useCallback((val: number[]) => {
    const v = val[0];
    const range = patientPrice - quickPrice;
    const snap = Math.max(2, Math.round(range * 0.05));
    if (Math.abs(v - quickPrice) <= snap) setPrice(quickPrice);
    else if (Math.abs(v - fairPrice) <= snap) setPrice(fairPrice);
    else if (Math.abs(v - patientPrice) <= snap) setPrice(patientPrice);
    else setPrice(v);
  }, [quickPrice, fairPrice, patientPrice]);

  const sliderValue = Math.min(Math.max(price, quickPrice), patientPrice);

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title="Smart Pricing" />

      <div className="flex-1 flex flex-col px-4 pt-4">
        {/* Compact market data card */}
        <Card className="p-4 bg-card border-border mb-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">Market Data</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Similar items: <span className="font-semibold text-foreground">${data.marketLow} – ${data.marketHigh}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Average: <span className="font-semibold text-primary">${data.average}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {data.searches} people searched this week
          </p>
        </Card>

        {/* Slider section */}
        <div className="space-y-4 flex-1">
          <p className="text-center font-semibold text-foreground">Set Your Price</p>

          <div className="flex justify-between text-sm font-medium text-muted-foreground px-1">
            <span>Fast Sale</span>
            <span>Max Profit</span>
          </div>

          <div className="px-1">
            <Slider
              value={[sliderValue]}
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

          {/* Price display */}
          <div className="text-center space-y-1 py-4">
            <p className="text-5xl font-bold transition-colors duration-200" style={{ color: priceColorMap[zone] }}>
              ${price}
            </p>
            <p className="text-sm text-muted-foreground">Sells in {timeline}</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={() => navigate("/platforms", {
            state: { photos, itemTitle, category, price, location: itemLocation, description, isMovingSale, movingDate },
          })}
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-none"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
};

export default PricingIntelligence;
