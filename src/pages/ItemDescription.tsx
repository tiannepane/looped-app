import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ScreenHeader from "@/components/ScreenHeader";
import { categories, conditions } from "@/lib/fakeData";
import { cn } from "@/lib/utils";

const torontoLocations = [
  "Yonge & Bloor",
  "Yonge & Eglinton",
  "Dundas & Ossington",
  "Queen & Spadina",
  "King & Bathurst",
  "College & Spadina",
  "Bloor & Christie",
  "Queen & Broadview",
  "Danforth & Pape",
  "St. Clair & Bathurst",
];

// Dynamic suggestion generator based on input
const generateSuggestions = (input: string): string[] => {
  const lower = input.toLowerCase().trim();
  
  if (!lower) return [];
  
  // Keyword-based suggestion mappings
  const suggestionMap: Record<string, string[]> = {
    chair: ["Gaming chair, ergonomic", "Office chair, adjustable height", "Dining chairs (set of 4)"],
    desk: ["Standing desk, electric", "Computer desk with drawers", "Writing desk, solid wood"],
    table: ["Coffee table, mid-century", "Dining table, seats 6", "Side table, marble top"],
    sofa: ["Sectional sofa, L-shaped", "Leather sofa, 3-seater", "Sleeper sofa, queen size"],
    couch: ["Velvet couch, modern", "Leather couch, brown", "Sectional couch with chaise"],
    lamp: ["Floor lamp, adjustable", "Desk lamp, LED", "Vintage brass lamp"],
    tv: ["Samsung 55\" Smart TV", "LG OLED 65\"", "TV stand with mount"],
    phone: ["iPhone 14 Pro, 256GB", "Samsung Galaxy S23", "Google Pixel 8"],
    laptop: ["MacBook Pro 14\"", "Dell XPS 15, like new", "Gaming laptop, RTX 4070"],
    bike: ["Mountain bike, 21-speed", "Road bike, carbon frame", "Electric bike, 500W"],
    camera: ["Canon EOS R6", "Sony A7 III with lens", "GoPro Hero 12"],
    shoes: ["Nike Air Max, size 10", "Running shoes, barely worn", "Leather boots, size 9"],
    jacket: ["Winter jacket, North Face", "Leather jacket, medium", "Rain jacket, waterproof"],
    dresser: ["6-drawer dresser, white", "Vintage dresser, oak", "Modern dresser with mirror"],
    bed: ["Queen bed frame, wood", "King mattress, memory foam", "Bunk bed, solid pine"],
    bookshelf: ["5-tier bookshelf, walnut", "Floating shelves (set)", "Corner bookshelf, tall"],
  };

  // Find matching suggestions
  for (const [keyword, suggestions] of Object.entries(suggestionMap)) {
    if (lower.includes(keyword)) {
      return suggestions;
    }
  }

  // Generic suggestions based on partial input
  if (lower.length >= 2) {
    return [
      `${input}, excellent condition`,
      `${input}, barely used`,
      `${input}, like new in box`,
    ];
  }

  return [];
};

const ItemDescription = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => generateSuggestions(title), [title]);
  const locationSuggestions = useMemo(() => {
    if (!location.trim()) return torontoLocations;
    return torontoLocations.filter((l) =>
      l.toLowerCase().includes(location.toLowerCase())
    );
  }, [location]);
  const isValid = title.trim() && category && condition && location.trim();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setTitle(suggestion.slice(0, 60));
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title="Item Details" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="title" className="text-sm font-medium">
                What are you selling?
              </Label>
              <span className="text-xs text-muted-foreground">
                {title.length}/60
              </span>
            </div>
            <Input
              id="title"
              placeholder="e.g. IKEA coffee table"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 60))}
              className="h-12 rounded-xl"
            />
          </div>

          {/* AI Suggestions - only show when user has typed something */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
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
            <Label className="text-sm font-medium">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 rounded-xl">
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

          {/* Location */}
          <div className="space-y-2" ref={locationRef}>
            <Label htmlFor="location" className="text-sm font-medium">
              📍 Where is it located? <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="location"
                placeholder="e.g., Yonge & Bloor, Queen West, etc."
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowLocationSuggestions(true);
                }}
                onFocus={() => setShowLocationSuggestions(true)}
                className="h-12 rounded-xl capitalize"
                autoCapitalize="words"
              />
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-xl shadow-lg max-h-[200px] overflow-y-auto">
                  {locationSuggestions.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setShowLocationSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      📍 {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setLocation("Yonge & Bloor");
                setShowLocationSuggestions(false);
              }}
              className="text-sm font-medium text-primary hover:underline"
            >
              Or use current location
            </button>
          </div>

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
                Description
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
              className="min-h-[120px] rounded-xl resize-none"
            />
          </div>
        </div>
      </div>

      {/* Next button */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={() => navigate("/pricing", { state: { itemTitle: title, category, location } })}
          disabled={!isValid}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-300 ease-out disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ItemDescription;
