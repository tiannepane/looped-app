import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScreenHeader from "@/components/ScreenHeader";
import { supabase } from "@/lib/supabase";

const PricingIntelligence = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    photos = [],
    title = "",
    category = "",
    postalCode = "",
    condition = "",
    size = "",
    description = "",
  } = (location.state as Record<string, any>) || {};

  const [price, setPrice] = useState<number>(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000, avg: 100 });
  const [loading, setLoading] = useState(true);
  const [sampleCount, setSampleCount] = useState(0);
  const [locationType, setLocationType] = useState("");

  const extractSubcategory = (title: string, category: string): string => {
    const titleLower = title.toLowerCase();

    if (category === "Electronics") {
      if (titleLower.includes("laptop") || titleLower.includes("macbook")) return "Laptop";
      if (titleLower.includes("monitor") || titleLower.includes("screen")) return "Monitor";
      if (titleLower.includes("phone") || titleLower.includes("iphone")) return "Phone";
      if (titleLower.includes("tablet") || titleLower.includes("ipad")) return "Tablet";
      return "Laptop";
    }

    if (category === "Furniture") {
      if (titleLower.includes("dining table") || titleLower.includes("dinner table")) return "Dining Table";
      if (titleLower.includes("coffee table")) return "Coffee Table";
      if (titleLower.includes("desk")) return "Desk";
      if (titleLower.includes("sofa") || titleLower.includes("couch")) return "Sofa";
      if (titleLower.includes("table")) return "Dining Table";
      return "Dining Table";
    }

    return "General";
  };

  const getPricingData = async (category: string, subcategory: string, postalCode: string) => {
    try {
      const postalPrefix = postalCode.substring(0, 3).toUpperCase();

      let { data } = await supabase
        .from("pricing_data")
        .select("*")
        .eq("category", category)
        .eq("subcategory", subcategory)
        .eq("postal_code_prefix", postalPrefix)
        .maybeSingle();

      if (data) {
        return { ...data, location_type: "exact" };
      }

      const areaPrefix = postalPrefix.substring(0, 2);
      ({ data } = await supabase
        .from("pricing_data")
        .select("*")
        .eq("category", category)
        .eq("subcategory", subcategory)
        .like("postal_code_prefix", `${areaPrefix}%`)
        .order("confidence_score", { ascending: false })
        .limit(1)
        .maybeSingle());

      if (data) {
        return { ...data, location_type: "area" };
      }

      ({ data } = await supabase
        .from("pricing_data")
        .select("*")
        .eq("category", category)
        .eq("subcategory", subcategory)
        .eq("postal_code_prefix", "TORONTO")
        .maybeSingle());

      if (data) {
        return { ...data, location_type: "fallback" };
      }

      ({ data } = await supabase
        .from("pricing_data")
        .select("*")
        .eq("category", category)
        .eq("postal_code_prefix", "TORONTO")
        .order("confidence_score", { ascending: false })
        .limit(1)
        .maybeSingle());

      if (data) {
        return { ...data, location_type: "fallback" };
      }

      return null;
    } catch (error) {
      console.error("Error fetching pricing data:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchPricingData = async () => {
      setLoading(true);

      const subcategory = extractSubcategory(title, category);

      const data = await getPricingData(category, subcategory, postalCode);

      if (data) {
        setPriceRange({
          min: data.min_price,
          max: data.max_price,
          avg: data.avg_price,
        });
        setPrice(data.avg_price);
        setSampleCount(data.sample_count || 0);
        setLocationType(data.location_type || "area");
      } else {
        setPriceRange({ min: 50, max: 500, avg: 150 });
        setPrice(150);
      }

      setLoading(false);
    };

    fetchPricingData();
  }, [title, category, postalCode]);

  const getLocationText = () => {
    if (locationType === "exact") return "in your neighborhood";
    if (locationType === "area") return "in your area";
    return "in Toronto";
  };

  const handleContinue = () => {
    navigate("/platforms", {
      state: {
        photos,
        title,
        category,
        price,
        postalCode,
        description,
        condition,
        size,
      },
    });
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-background">
        <ScreenHeader title="Set Your Price" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title="Set Your Price" />

      <div className="flex-1 overflow-y-auto p-6 pb-24 flex flex-col items-center justify-center">
        
        {/* Price Display - Hero Element */}
        <div className="text-center mb-12">
          <p className="text-7xl font-bold text-primary mb-3">
            ${price}
          </p>
          <p className="text-sm text-muted-foreground">
            Based on {sampleCount} sold items {getLocationText()}
          </p>
        </div>

        {/* Price Slider */}
        <div className="w-full max-w-md px-4">
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mb-6"
            style={{
              background: `linear-gradient(to right, #f97316 0%, #f97316 ${
                ((price - priceRange.min) / (priceRange.max - priceRange.min)) * 100
              }%, #e5e7eb ${
                ((price - priceRange.min) / (priceRange.max - priceRange.min)) * 100
              }%, #e5e7eb 100%)`
            }}
          />
          
          {/* Slider Labels - Cleaner, Centered */}
          <div className="flex justify-between items-center px-1">
            {/* Quick Sale */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">Quick sale</span>
              <span className="text-sm font-semibold text-foreground">${priceRange.min}</span>
            </div>
            
            {/* Market Average */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">Market avg</span>
              <span className="text-sm font-semibold text-foreground">${priceRange.avg}</span>
            </div>
            
            {/* Patient */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">Patient</span>
              <span className="text-sm font-semibold text-foreground">${priceRange.max}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Fixed Bottom Button */}
      <div className="p-4 bg-background border-t border-border">
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PricingIntelligence;