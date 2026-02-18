import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
    // Go back to 3A, preserving all data
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
      <div className="flex justify-center gap-2 py-2">
        <div className="w-2 h-2 rounded-full bg-muted" />
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Condition */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Condition</Label>
            <div className="grid grid-cols-4 gap-2">
              {conditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setCondition(cond)}
                  className={cn(
                    "py-2.5 px-2 text-xs font-medium rounded-xl border-2 transition-all duration-200",
                    condition === cond
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  )}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <span className="text-xs text-muted-foreground">
                {description.length}/500
              </span>
            </div>
            <Textarea
              id="description"
              placeholder="Describe your item... Include details like size, color, brand, and any flaws."
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              className="min-h-[100px] rounded-xl resize-none"
            />
            <p className="text-xs text-muted-foreground">
              💡 Tip: Mention size, color, brand, or any flaws
            </p>
          </div>

          {/* Moving Sale Toggle */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              🏠 Is this part of a moving sale?
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsMovingSale(false)}
                className={cn(
                  "py-3 px-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 text-left",
                  !isMovingSale
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                )}
              >
                No, individual item
              </button>
              <button
                onClick={() => setIsMovingSale(true)}
                className={cn(
                  "py-3 px-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 text-left",
                  isMovingSale
                    ? "border-orange-400 bg-orange-50 text-orange-900 dark:bg-orange-950 dark:text-orange-200"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                )}
              >
                Yes, moving soon
              </button>
            </div>

            {isMovingSale && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    When are you moving? (optional)
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-14 justify-start text-left font-normal rounded-xl",
                          !movingDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
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
                  <p className="text-xs text-muted-foreground">
                    Helps buyers know your timeline
                  </p>
                </div>
                <p className="text-sm" style={{ color: "#F97316" }}>
                  💡 Tip: Price 10-15% below market for quick moving sales
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continue button */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={handleContinue}
          disabled={!isValid}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-300 ease-out disabled:opacity-50"
        >
          Continue to Pricing
        </Button>
      </div>
    </div>
  );
};

export default ItemDetails;
