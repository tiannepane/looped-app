import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-9 h-9 text-primary-foreground"
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

        {/* Brand name */}
        <h2 className="text-2xl font-bold text-primary mb-12">Looped</h2>

        {/* Welcome text */}
        <h1 className="text-2xl font-semibold text-foreground text-center leading-tight mb-4">
          What would you like to sell today?
        </h1>
        <p className="text-muted-foreground text-center mb-12 text-sm leading-relaxed">
          Post once, sell everywhere. We'll list your item on multiple platforms automatically.
        </p>

        {/* CTA Button */}
        <Button
          onClick={() => navigate("/photo")}
          size="lg"
          className="w-full max-w-xs h-14 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02]"
        >
          Start Selling
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
