import { Home, Package, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Package, label: "My Items", path: "/dashboard" },
    { icon: User, label: "Account", path: "/account" },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-card border-t border-border flex items-center justify-around px-4 pb-4">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200 ease-out",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5]")} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
