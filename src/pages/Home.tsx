import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
        {/* Logo */}
        <div className="mb-3">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-8 h-8 text-primary-foreground"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        </div>

        {/* Wordmark */}
        <h2 className="text-xl font-bold text-primary mb-16">Looped</h2>

        {/* Headline */}
        <h1 className="text-2xl font-bold text-foreground text-center leading-tight mb-3">
          Sell faster with
          <br />
          smart pricing
        </h1>

        {/* Subheadline */}
        <p className="text-base text-muted-foreground text-center mb-10">
          Know the right price in 30 seconds
        </p>

        {/* CTA */}
        <Button
          onClick={() => navigate("/photo")}
          className="w-full max-w-xs h-14 text-lg font-medium rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-lg shadow-orange-500/25 transition-all duration-300"
        >
          Get Started
        </Button>

        {/* Pricing note */}
        <p className="text-sm text-muted-foreground mt-4">
          Free to try • $5/month
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
