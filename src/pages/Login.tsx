import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValid = isValidEmail && password.length >= 6;

  const handleLogin = () => {
    setError("");
    // Mock auth
    localStorage.setItem("looped_auth", JSON.stringify({ email, loggedIn: true }));
    navigate("/");
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center px-6" style={{ paddingTop: "80px" }}>
        {/* Logo */}
        <div className="mb-3">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-primary-foreground" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-primary mb-6">Looped</h2>

        {/* Title */}
        <h1 className="text-[28px] font-bold text-foreground mb-6">Welcome back</h1>

        {/* Form */}
        <div className="w-full space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl"
              style={{ height: "60px", fontSize: "16px", padding: "16px" }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl"
              style={{ height: "60px", fontSize: "16px", padding: "16px" }}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            onClick={handleLogin}
            disabled={!isValid}
            className="w-full font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-none transition-all duration-300 disabled:opacity-50"
            style={{ height: "60px", fontSize: "18px", marginTop: "24px" }}
          >
            Log In
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Sign up link */}
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button onClick={() => navigate("/signup")} className="text-primary font-semibold hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
