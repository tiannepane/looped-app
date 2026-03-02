import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ScreenHeader from "@/components/ScreenHeader";

const conditions = ["New", "Like New", "Good", "Fair"];

const ItemDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    photos = [], 
    title = "", 
    category = "", 
    postalCode = "",
    aiSuggestions = null
  } = (location.state as Record<string, any>) || {};

  const [condition, setCondition] = useState(aiSuggestions?.condition || "Good");
  const [size, setSize] = useState(aiSuggestions?.size || "");
  const [description, setDescription] = useState(aiSuggestions?.description || "");
  const [showAiBanner, setShowAiBanner] = useState(!!aiSuggestions);

  useEffect(() => {
    if (aiSuggestions) {
      if (aiSuggestions.condition) setCondition(aiSuggestions.condition);
      if (aiSuggestions.size) setSize(aiSuggestions.size);
      if (aiSuggestions.description) setDescription(aiSuggestions.description);
    }
  }, [aiSuggestions]);

  const handleContinue = () => {
    navigate("/pricing", {
      state: {
        photos,
        title,
        category,
        postalCode,
        condition,
        size,
        description,
      },
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title={`Item Details (2/2)`} />

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* AI Banner */}
        {showAiBanner && aiSuggestions && (
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-3 mb-4 relative">
            <button
              onClick={() => setShowAiBanner(false)}
              className="absolute top-2 right-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              ✕
            </button>
            <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
              ✨ AI filled these details! Please review, especially size. You can edit anything.
            </p>
          </div>
        )}

        {/* Condition */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-foreground">
            Condition
          </label>
          <div className="grid grid-cols-4 gap-2">
            {conditions.map((cond) => (
              <button
                key={cond}
                onClick={() => setCondition(cond)}
                className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                  condition === cond
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {cond}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-foreground">
            Size
          </label>
          <Input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g., 15-inch screen, Large, 6ft x 4ft"
            className="h-12 rounded-xl"
          />
          {aiSuggestions?.size && (
            <p className="text-xs text-muted-foreground mt-2">
              💡 AI estimate - please measure for accuracy
            </p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">
              Description <span className="text-destructive">*</span>
            </label>
            <span className="text-xs text-muted-foreground">
              {description.length}/500
            </span>
          </div>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            placeholder="Describe your item's condition, why you're selling, any flaws..."
            className="min-h-[200px] rounded-xl resize-none"
            maxLength={500}
          />
          <p className="text-xs text-primary mt-2">
            💡 Tip: Fill in the template or write your own description
          </p>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="p-4 bg-background border-t border-border">
        <Button
          onClick={handleContinue}
          disabled={!description.trim()}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl disabled:opacity-50"
        >
          Continue to Pricing
        </Button>
      </div>
    </div>
  );
};

export default ItemDetails;