import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const Home = () => {
  const navigate = useNavigate();

  const isLoggedIn = (() => {
    try {
      const auth = JSON.parse(localStorage.getItem("looped_auth") || "{}");
      return auth.loggedIn === true;
    } catch { return false; }
  })();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/photo");
    } else {
      navigate("/login");
    }
  };

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

        {/* Login link */}
        {!isLoggedIn && (
          <p className="text-sm text-muted-foreground mb-4">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-primary font-semibold hover:underline">Log In</button>
          </p>
        )}

        {/* CTA */}
        <Button
          onClick={handleGetStarted}
          className="w-full max-w-xs h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-none transition-all duration-300"
        >
          Get Started
        </Button>

        {/* Pricing note */}
        <p className="text-sm text-muted-foreground mt-4">
          $5 for 30 days • Renew when you need it
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
