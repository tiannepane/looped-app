import { useState } from "react";
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
import { categories, conditions, aiSuggestions } from "@/lib/fakeData";
import { cn } from "@/lib/utils";

const ItemDescription = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");

  const isValid = title.trim() && category && condition;

  const handleSuggestionClick = (suggestion: string) => {
    setTitle(suggestion.slice(0, 60));
    if (!category) setCategory("Furniture");
    if (!condition) setCondition("Like New");
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

          {/* AI Suggestions */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Quick suggestions
            </Label>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((suggestion, index) => (
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
          onClick={() => navigate("/pricing")}
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
