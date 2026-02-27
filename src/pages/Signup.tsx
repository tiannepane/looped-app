import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const getPasswordStrength = (pw: string): { label: string; color: string; width: string } => {
  if (pw.length < 6) return { label: "Too short", color: "bg-destructive", width: "w-1/4" };
  if (pw.length < 8) return { label: "Weak", color: "bg-destructive", width: "w-1/3" };
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (score >= 2) return { label: "Strong", color: "bg-primary", width: "w-full" };
  return { label: "Medium", color: "bg-amber-500", width: "w-2/3" };
};

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsMatch = password === confirm && confirm.length > 0;
  const isValid = name.trim() && isValidEmail && password.length >= 6 && passwordsMatch;

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSignup = () => {
    localStorage.setItem("looped_auth", JSON.stringify({ email, name, loggedIn: true }));
    navigate("/");
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto flex flex-col items-center px-6" style={{ paddingTop: "60px" }}>
        {/* Title */}
        <h1 className="text-[28px] font-bold text-foreground mb-6">Create Account</h1>

        {/* Form */}
        <div className="w-full space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
              style={{ height: "60px", fontSize: "16px", padding: "16px" }}
            />
          </div>

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl"
              style={{ height: "60px", fontSize: "16px", padding: "16px" }}
            />
            {password.length > 0 && (
              <div className="space-y-1">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} ${strength.width} rounded-full transition-all duration-300`} />
                </div>
                <p className="text-xs text-muted-foreground">{strength.label}</p>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="rounded-xl"
              style={{ height: "60px", fontSize: "16px", padding: "16px" }}
            />
            {confirm.length > 0 && !passwordsMatch && (
              <p className="text-xs text-destructive">Passwords don't match</p>
            )}
          </div>

          <Button
            onClick={handleSignup}
            disabled={!isValid}
            className="w-full font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-none transition-all duration-300 disabled:opacity-50"
            style={{ height: "60px", fontSize: "18px", marginTop: "24px" }}
          >
            Create Account
          </Button>
        </div>

        {/* Login link */}
        <p className="text-sm text-muted-foreground mt-6 pb-8">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-primary font-semibold hover:underline">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
