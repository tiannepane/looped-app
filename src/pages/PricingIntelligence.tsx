import { useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

const getZoneInfo = (price: number, quick: number, fair: number, patient: number) => {
  const range = patient - quick;
  const lowThreshold = quick + range * 0.33;
  const highThreshold = quick + range * 0.67;

  if (price <= lowThreshold) {
    return {
      color: "#10B981",
      timeline: "1-3 days",
      badge: "✓ Priced for quick sale",
      tip: "💡 Priced 10% below average for fast sale. Great for urgent moves.",
    };
  }
  if (price <= highThreshold) {
    return {
      color: "#F97316",
      timeline: "3-7 days",
      badge: "✓ Recommended Price — Balanced approach",
      tip: "💡 Priced at market average. Balanced speed and profit.",
    };
  }
  return {
    color: "#EF4444",
    timeline: "7-14 days",
    badge: "⚠️ Priced above market — May take longer",
    tip: "💡 Priced 10% above average. Maximizes profit but may take longer.",
  };
};

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

  const zone = useMemo(() => getZoneInfo(price, quickPrice, fairPrice, patientPrice), [price, quickPrice, fairPrice, patientPrice]);

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

      <div className="flex-1 flex flex-col px-6 pt-4">
        {/* Market Data - simple centered text */}
        <div className="text-center" style={{ marginBottom: "24px" }}>
          <p className="font-bold text-foreground" style={{ fontSize: "16px" }}>
            Market average: <span style={{ color: "#F97316" }}>${data.average}</span>
          </p>
          <p className="text-muted-foreground" style={{ fontSize: "14px" }}>
            Similar items: ${data.marketLow} – ${data.marketHigh}
          </p>
        </div>

        {/* Slider Section */}
        <p className="text-center font-bold text-foreground" style={{ fontSize: "18px", marginBottom: "16px" }}>
          Choose Your Speed
        </p>

        <div className="flex justify-between px-1" style={{ fontSize: "14px", color: "hsl(var(--muted-foreground))", marginBottom: "8px" }}>
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

        {/* Price markers */}
        <div className="flex justify-between text-center px-1" style={{ marginTop: "8px", marginBottom: "32px" }}>
          <div className="flex flex-col items-start">
            <span className={`font-semibold ${price === quickPrice ? "text-foreground" : "text-muted-foreground"}`} style={{ fontSize: "14px" }}>
              ${quickPrice}
            </span>
            <span className="text-muted-foreground" style={{ fontSize: "12px" }}>1-3 days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className={`font-semibold ${price === fairPrice ? "text-foreground" : "text-muted-foreground"}`} style={{ fontSize: "14px" }}>
              ${fairPrice}
            </span>
            <span className="text-muted-foreground" style={{ fontSize: "12px" }}>3-7 days</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`font-semibold ${price === patientPrice ? "text-foreground" : "text-muted-foreground"}`} style={{ fontSize: "14px" }}>
              ${patientPrice}
            </span>
            <span className="text-muted-foreground" style={{ fontSize: "12px" }}>7-14 days</span>
          </div>
        </div>

        {/* Large price display */}
        <div className="text-center" style={{ marginBottom: "24px" }}>
          <p className="font-bold transition-colors duration-200" style={{ fontSize: "56px", color: zone.color, lineHeight: 1.1 }}>
            ${price}
          </p>
          <p className="text-muted-foreground" style={{ fontSize: "16px", marginTop: "4px" }}>
            Sells in {zone.timeline}
          </p>
        </div>

      </div>

      {/* CTA */}
      <div style={{ padding: "0 24px 24px" }}>
        <Button
          onClick={() => navigate("/platforms", {
            state: { photos, itemTitle, category, price, location: itemLocation, description, isMovingSale, movingDate },
          })}
          className="w-full font-semibold text-primary-foreground shadow-none"
          style={{ height: "60px", fontSize: "18px", borderRadius: "12px", background: "#F97316" }}
        >
          Continue →
        </Button>
      </div>
    </div>
  );
};

export default PricingIntelligence;
