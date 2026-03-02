import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/photo");
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-8 h-8 text-primary-foreground animate-spin"
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
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
            <button onClick={() => navigate("/login")} className="text-primary font-semibold hover:underline">
              Log In
            </button>
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
          Free to start • Premium for power sellers
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;