import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Where does Looped get its prices from?",
    answer: "Looped uses AI-powered pricing intelligence that analyzes real sold listings from Facebook Marketplace, Kijiji, and Karrot. Our system constantly scrapes and updates pricing data based on what similar items actually sold for in your area, not just asking prices."
  },
  {
    question: "Can I post directly to marketplaces from Looped?",
    answer: "Not yet! Currently, Looped helps you create the perfect listing with AI-generated descriptions and competitive pricing, then provides easy copy-paste tools for Facebook Marketplace, Kijiji, and Karrot. You'll post manually to each platform, which gives you full control and compliance with each marketplace's policies."
  },
  {
    question: "How accurate is the AI pricing?",
    answer: "Our AI pricing is based on actual sold listings in your specific neighborhood, not just asking prices. The more data we have for your area and item category, the more accurate the suggestion. You can always adjust the price, and we'll show you how it affects your estimated sell time."
  },
  {
    question: "What if I want to sell fast vs. get the best price?",
    answer: "Our pricing slider shows you the trade-off! Price below market average for a quick 1-2 day sale, at average for 3-5 days, or above average if you're willing to wait 7-14 days. We'll show you exactly how your price choice affects sell time based on real data."
  },
  {
    question: "Do I need to take my own photos?",
    answer: "Yes! You upload photos of your actual item. Our AI analyzes them to suggest a title, description, category, and price. Good photos help the AI give better suggestions and help you sell faster on marketplaces."
  }
];

const FAQ = () => {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 flex items-center px-4 bg-background border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-accent rounded-lg transition-colors -ml-2"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground ml-2">FAQ</h1>
      </header>

      {/* FAQ List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-card rounded-2xl border border-border overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full p-4 flex items-center justify-between gap-3 hover:bg-accent transition-colors text-left"
            >
              <p className="font-medium text-foreground flex-1">
                {faq.question}
              </p>
              {expandedFAQ === index ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
            </button>
            
            {expandedFAQ === index && (
              <div className="px-4 pb-4 pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;