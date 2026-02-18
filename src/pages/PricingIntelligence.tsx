import { useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TrendingUp, Flame } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { differenceInDays, parseISO, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
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
  if (price <= patient) return "5-10 days";
  if (price <= patient * 1.15) return "10-14+ days";
  return "14+ days or may not sell";
};

const getContext = (price: number, quick: number, fair: number, patient: number) => {
  const greenThreshold = quick + (patient - quick) * 0.1;
  if (price <= greenThreshold) return "Great for quick sales";
  if (price <= patient) return "Leans towards max profit";
  if (price <= patient * 1.15) return "May take a while to sell";
  return "Significantly above market";
};

const priceColorMap = {
  green: "#10B981",
  orange: "#F59E0B",
  red: "#EF4444",
};

const PricingIntelligence = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const {
    photos = [],
    itemTitle = "item",
    category = "Other",
    location: itemLocation = "",
    isMovingSale = false,
    movingDate = null,
  } = (loc.state as { photos?: string[]; itemTitle?: string; category?: string; location?: string; isMovingSale?: boolean; movingDate?: string | null }) || {};

  const [showMovingTip, setShowMovingTip] = useState(true);

  const movingInfo = useMemo(() => {
    if (!isMovingSale || !movingDate) return null;
    const date = parseISO(movingDate);
    const daysAway = differenceInDays(date, new Date());
    const dateStr = format(date, "MMMM d");
    let urgency = `That's ${daysAway} days away`;
    if (daysAway <= 7) urgency = `That's only ${daysAway} days away — price aggressively!`;
    if (daysAway <= 0) urgency = "Your move date has passed!";
    return { dateStr, daysAway, urgency };
  }, [isMovingSale, movingDate]);

  const data = useMemo(() => matchPricingData(itemTitle), [itemTitle]);
  const { quickPrice, fairPrice, patientPrice } = data;

  const [price, setPrice] = useState(fairPrice);
  const [customInput, setCustomInput] = useState("");

  const zone = useMemo(() => getPriceZone(price, quickPrice, patientPrice), [price, quickPrice, patientPrice]);
  const timeline = useMemo(() => getTimeline(price, quickPrice, fairPrice, patientPrice), [price, quickPrice, fairPrice, patientPrice]);
  const context = useMemo(() => getContext(price, quickPrice, fairPrice, patientPrice), [price, quickPrice, fairPrice, patientPrice]);

  const handleSliderChange = useCallback((val: number[]) => {
    const v = val[0];
    const range = patientPrice - quickPrice;
    const snap = Math.max(2, Math.round(range * 0.05));
    if (Math.abs(v - quickPrice) <= snap) setPrice(quickPrice);
    else if (Math.abs(v - fairPrice) <= snap) setPrice(fairPrice);
    else if (Math.abs(v - patientPrice) <= snap) setPrice(patientPrice);
    else setPrice(v);
  }, [quickPrice, fairPrice, patientPrice]);

  const handleCustomPrice = useCallback(() => {
    const parsed = parseInt(customInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 9999) {
      setPrice(parsed);
      setCustomInput("");
    }
  }, [customInput]);

  const searchLabel = itemTitle.length > 35 ? itemTitle.slice(0, 35) + "..." : itemTitle;
  const sliderValue = Math.min(Math.max(price, quickPrice), patientPrice);

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title="Smart Pricing for Quick Sales" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5">
          {/* Moving Sale Tip Dialog */}
          <Dialog open={isMovingSale && showMovingTip} onOpenChange={setShowMovingTip}>
            <DialogContent className="rounded-2xl max-w-[340px]" style={{ backgroundColor: "#FFF7ED" }}>
              <DialogHeader>
                <DialogTitle className="text-base" style={{ color: "#9A3412" }}>
                  💡 Moving Sale Pricing Tip
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <p className="text-sm" style={{ color: "#78350F" }}>
                  For urgent moving sales, we recommend the Quick Sale price (1-3 days) to guarantee fast turnover.
                </p>
                {movingInfo && (
                  <div className="text-sm" style={{ color: "#9A3412" }}>
                    <p>Your moving date: {movingInfo.dateStr}</p>
                    <p className="font-medium">{movingInfo.urgency}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>


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
          </div>

          {/* Live price display */}
          <div className="text-center space-y-1 py-4">
            <p className="text-5xl font-bold transition-colors duration-200" style={{ color: priceColorMap[zone] }}>
              ${price}
            </p>
            <p className="text-sm text-muted-foreground">Likely sells in {timeline}</p>
            <p className="text-xs text-muted-foreground">{context}</p>
          </div>

          {/* Custom price input */}
          <div className="text-center space-y-3 pb-2">
            <p className="text-sm text-muted-foreground">Or enter custom price</p>
            <div className="flex items-center justify-center gap-2">
              <div className="relative w-[100px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  type="number"
                  min={1}
                  max={9999}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomPrice()}
                  placeholder={String(price)}
                  className="pl-7 h-10 text-sm rounded-lg border-border"
                />
              </div>
              <Button
                onClick={handleCustomPrice}
                variant="secondary"
                className="h-10 px-4 text-sm rounded-lg"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={() => navigate("/platforms", { state: { photos, itemTitle, category, price, location: itemLocation, isMovingSale, movingDate } })}
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
