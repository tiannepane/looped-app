import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ScreenHeader from "@/components/ScreenHeader";
import { categories } from "@/lib/fakeData";
import {
  getNeighborhood,
  isValidPostalPrefix,
} from "@/lib/postalCodeMap";

const generateSuggestions = (input: string): string[] => {
  const lower = input.toLowerCase().trim();
  if (!lower) return [];

  const suggestionMap: Record<string, string[]> = {
    chair: ["Gaming chair, ergonomic", "Office chair, adjustable height", "Dining chairs (set of 4)"],
    desk: ["Standing desk, electric", "Computer desk with drawers", "Writing desk, solid wood"],
    table: ["Coffee table, mid-century", "Dining table, seats 6", "Side table, marble top"],
    sofa: ["Sectional sofa, L-shaped", "Leather sofa, 3-seater", "Sleeper sofa, queen size"],
    couch: ["Velvet couch, modern", "Leather couch, brown", "Sectional couch with chaise"],
    lamp: ["Floor lamp, adjustable", "Desk lamp, LED", "Vintage brass lamp"],
    tv: ['Samsung 55" Smart TV', 'LG OLED 65"', "TV stand with mount"],
    phone: ["iPhone 14 Pro, 256GB", "Samsung Galaxy S23", "Google Pixel 8"],
    laptop: ['MacBook Pro 14"', "Dell XPS 15, like new", "Gaming laptop, RTX 4070"],
    bike: ["Mountain bike, 21-speed", "Road bike, carbon frame", "Electric bike, 500W"],
    camera: ["Canon EOS R6", "Sony A7 III with lens", "GoPro Hero 12"],
    shoes: ["Nike Air Max, size 10", "Running shoes, barely worn", "Leather boots, size 9"],
    jacket: ["Winter jacket, North Face", "Leather jacket, medium", "Rain jacket, waterproof"],
    dresser: ["6-drawer dresser, white", "Vintage dresser, oak", "Modern dresser with mirror"],
    bed: ["Queen bed frame, wood", "King mattress, memory foam", "Bunk bed, solid pine"],
    bookshelf: ["5-tier bookshelf, walnut", "Floating shelves (set)", "Corner bookshelf, tall"],
  };

  for (const [keyword, suggestions] of Object.entries(suggestionMap)) {
    if (lower.includes(keyword)) return suggestions;
  }

  if (lower.length >= 2) {
    return [
      `${input}, excellent condition`,
      `${input}, barely used`,
      `${input}, like new in box`,
    ];
  }
  return [];
};

const ItemWhatWhere = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const incoming = (location.state as Record<string, unknown>) || {};

  const photos = (incoming.photos as string[]) || [];
  const [title, setTitle] = useState((incoming.title as string) || "");
  const [category, setCategory] = useState((incoming.category as string) || "");
  const [postalCode, setPostalCode] = useState((incoming.postalCode as string) || "");
  const [showPostalError, setShowPostalError] = useState(false);

  const suggestions = useMemo(() => generateSuggestions(title), [title]);

  const neighborhood = useMemo(() => {
    const clean = postalCode.toUpperCase().replace(/\s/g, "");
    if (clean.length === 3 && isValidPostalPrefix(clean)) {
      return getNeighborhood(clean);
    }
    return null;
  }, [postalCode]);

  const postalValid = isValidPostalPrefix(postalCode);
  const isValid = title.trim() && category && postalValid;

  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, "").toUpperCase();
    const filtered = raw.replace(/[^A-Z0-9]/g, "").slice(0, 3);
    setPostalCode(filtered);
    setShowPostalError(false);
  };

  const handleNext = () => {
    if (!postalValid) {
      setShowPostalError(true);
      return;
    }
    navigate("/details", {
      state: {
        photos,
        title,
        category,
        postalCode,
        condition: incoming.condition || "",
        description: incoming.description || "",
      },
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTitle(suggestion.slice(0, 60));
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title="Item Details (1/2)" />

      {/* Progress dots */}
      <div className="flex justify-center gap-4 py-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-muted" />
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1 px-6 flex flex-col" style={{ gap: "20px", paddingTop: "12px" }}>
          {/* Title */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="title" className="text-lg font-bold">
                What are you selling?
              </Label>
              <span className="text-sm text-muted-foreground">
                {title.length}/60
              </span>
            </div>
            <Input
              id="title"
              placeholder="e.g. IKEA coffee table"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 60))}
              className="rounded-xl"
              style={{ height: "52px", fontSize: "16px", padding: "16px" }}
            />
          </div>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-1 -mt-3">
              <Label className="text-sm text-muted-foreground">
                ✨ AI suggestions
              </Label>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-lg font-bold">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                className="rounded-xl"
                style={{ height: "52px", fontSize: "16px", padding: "16px" }}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location — Postal Code */}
          <div className="space-y-2">
            <Label className="text-lg font-bold">
              Where is this located?
            </Label>

            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-sm text-muted-foreground">
                📮 Your postal code (first 3 characters only) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="postalCode"
                placeholder="M5V"
                value={postalCode}
                onChange={handlePostalChange}
                maxLength={3}
                autoCapitalize="characters"
                className="rounded-xl font-semibold text-center uppercase"
                style={{ height: "60px", width: "120px", fontSize: "24px", letterSpacing: "4px" }}
              />
            </div>

            {postalValid && neighborhood && (
              <p
                className="text-base font-medium transition-all duration-200"
                style={{ color: "#10B981" }}
              >
                ✓ This is in {neighborhood}
              </p>
            )}

            {showPostalError && !postalValid && (
              <p className="text-sm text-destructive">
                Please enter first 3 characters of your Toronto postal code (e.g., M5V)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Next button */}
      <div className="px-6 pb-6 pt-3 border-t border-border">
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="w-full font-semibold rounded-xl transition-all duration-300 ease-out disabled:opacity-50"
          style={{ height: "52px", fontSize: "18px" }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ItemWhatWhere;
