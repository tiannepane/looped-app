import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ScreenHeader from "@/components/ScreenHeader";
import { conditions } from "@/lib/fakeData";
import { cn } from "@/lib/utils";
import { getLocationDisplay } from "@/lib/postalCodeMap";

const ItemDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const incoming = (location.state as Record<string, unknown>) || {};
  const title = (incoming.title as string) || "";
  const category = (incoming.category as string) || "";
  const postalCode = (incoming.postalCode as string) || "";

  const [condition, setCondition] = useState((incoming.condition as string) || "");
  const [description, setDescription] = useState((incoming.description as string) || "");
  const [isMovingSale, setIsMovingSale] = useState(!!incoming.isMovingSale);
  const [movingDate, setMovingDate] = useState<Date | undefined>(
    incoming.movingDate ? new Date(incoming.movingDate as string) : undefined
  );

  const isValid = condition.length > 0;

  const handleContinue = () => {
    const locationDisplay = getLocationDisplay(postalCode);
    navigate("/pricing", {
      state: {
        itemTitle: title,
        category,
        location: locationDisplay,
        isMovingSale,
        movingDate: movingDate ? movingDate.toISOString() : null,
      },
    });
  };

  const handleBack = () => {
    navigate("/description", {
      state: {
        title,
        category,
        postalCode,
        condition,
        description,
        isMovingSale,
        movingDate: movingDate ? movingDate.toISOString() : null,
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
        <div className="flex-1 px-6 flex flex-col" style={{ gap: "40px", paddingTop: "16px" }}>
          {/* Condition */}
          <div className="space-y-3">
            <Label className="text-lg font-bold">Condition</Label>
            <div className="grid grid-cols-4 gap-2">
              {conditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setCondition(cond)}
                  className={cn(
                    "text-base font-medium rounded-xl border-2 transition-all duration-200",
                    condition === cond
                      ? "border-primary bg-primary text-primary-foreground"
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
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="description" className="text-lg font-bold">
                Description <span className="text-muted-foreground font-normal text-base">(optional)</span>
              </Label>
              <span className="text-sm text-muted-foreground">
                {description.length}/500
              </span>
            </div>
            <Textarea
              id="description"
              placeholder="Describe your item... Include details like size, color, brand, and any flaws."
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              className="rounded-xl resize-none"
              style={{ minHeight: "160px", fontSize: "16px", padding: "16px" }}
            />
            <p className="text-sm" style={{ color: "#F97316", marginTop: "12px" }}>
              💡 Tip: Mention size, color, brand, or any flaws
            </p>
          </div>

          {/* Moving Sale Toggle */}
          <div className="space-y-3">
            <Label className="text-lg font-bold">
              🏠 Is this part of a moving sale?
            </Label>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsMovingSale(false)}
                className={cn(
                  "flex items-center justify-between font-medium rounded-xl border-2 transition-all duration-200 text-left px-4",
                  !isMovingSale
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                )}
                style={{ height: "60px", fontSize: "16px" }}
              >
                No, individual item
                {!isMovingSale && <Check className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsMovingSale(true)}
                className={cn(
                  "flex items-center justify-between font-medium rounded-xl border-2 transition-all duration-200 text-left px-4",
                  isMovingSale
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                )}
                style={{ height: "60px", fontSize: "16px" }}
              >
                Yes, moving soon
                {isMovingSale && <Check className="w-5 h-5" />}
              </button>
            </div>

            {isMovingSale && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-2">
                  <Label className="text-base text-muted-foreground">
                    When are you moving? (optional)
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-xl",
                          !movingDate && "text-muted-foreground"
                        )}
                        style={{ height: "60px", fontSize: "16px", padding: "20px 16px" }}
                      >
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        {movingDate ? format(movingDate, "MMMM d, yyyy") : "e.g., March 15"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={movingDate}
                        onSelect={setMovingDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-sm text-muted-foreground">
                    Helps buyers know your timeline
                  </p>
                </div>

                {/* Moving sale tip box */}
                <div
                  className="rounded-lg"
                  style={{
                    background: "#FFF7ED",
                    padding: "16px",
                    borderLeft: "4px solid #F97316",
                    marginTop: "24px",
                    fontSize: "14px",
                  }}
                >
                  <p style={{ color: "#9A3412" }}>
                    💡 Tip: Price 10-15% below market for quick moving sales
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continue button */}
      <div className="px-6 pb-8 pt-4 border-t border-border">
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
  );
};

export default ItemDetails;
