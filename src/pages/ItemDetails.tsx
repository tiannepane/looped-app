import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ScreenHeader from "@/components/ScreenHeader";
import { conditions } from "@/lib/fakeData";
import { cn } from "@/lib/utils";
import { getLocationDisplay } from "@/lib/postalCodeMap";

const ItemDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const incoming = (location.state as Record<string, unknown>) || {};
  const photos = (incoming.photos as string[]) || [];
  const title = (incoming.title as string) || "";
  const category = (incoming.category as string) || "";
  const postalCode = (incoming.postalCode as string) || "";

  const [condition, setCondition] = useState((incoming.condition as string) || "");
  const defaultTemplate = "Size:\n\nCondition:\n\nMust be gone by:\n\nAdditional details:";
  const [description, setDescription] = useState((incoming.description as string) || defaultTemplate);

  const descriptionFilled = description.trim().length > 0 && description.trim() !== defaultTemplate.trim();
  const isValid = condition.length > 0 && descriptionFilled;

  const handleContinue = () => {
    const locationDisplay = getLocationDisplay(postalCode);
    navigate("/pricing", {
      state: {
        photos,
        itemTitle: title,
        category,
        location: locationDisplay,
        description,
        isMovingSale: false,
        movingDate: null,
      },
    });
  };

  const handleBack = () => {
    navigate("/description", {
      state: {
        photos,
        title,
        category,
        postalCode,
        condition,
        description,
      },
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title="Item Details (2/2)" onBack={handleBack} />

      {/* Progress dots */}
      <div className="flex justify-center gap-4 py-3">
        <div className="w-2 h-2 rounded-full bg-muted" />
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1 px-6 flex flex-col" style={{ gap: "40px", paddingTop: "32px" }}>
          {/* Condition */}
          <div>
            <Label className="font-bold" style={{ fontSize: "20px", marginBottom: "16px", display: "block" }}>
              Condition
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {conditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setCondition(cond)}
                  className={cn(
                    "font-semibold rounded-xl border-2 transition-all duration-200",
                    condition === cond
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  )}
                  style={{ height: "70px", fontSize: "16px" }}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center" style={{ marginBottom: "12px" }}>
              <Label htmlFor="description" style={{ fontSize: "16px", fontWeight: 500 }}>
                Description <span className="text-destructive" style={{ fontSize: "16px" }}>*</span>
              </Label>
              <span className="text-muted-foreground" style={{ fontSize: "14px" }}>
                {description.length}/500
              </span>
            </div>
            <Textarea
              id="description"
              placeholder={"Describe your item... Include size, color, brand, flaws.\n\nMoving sale? Add your move date for urgency."}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              className="rounded-xl resize-none border-border focus:border-primary transition-all duration-200 focus:shadow-sm"
              style={{ minHeight: "200px", fontSize: "16px", padding: "16px", flex: "1" }}
            />
            <p style={{ fontSize: "14px", color: "#F97316", marginTop: "12px" }}>
              💡 Tip: Fill in the template or write your own description
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="px-6 mt-auto" style={{ paddingBottom: "32px", paddingTop: "16px" }}>
          <Button
            onClick={handleContinue}
            disabled={!isValid}
            className="w-full font-semibold rounded-xl transition-all duration-300 ease-out disabled:opacity-50"
            style={{ height: "60px", fontSize: "18px" }}
          >
            Continue to Pricing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
