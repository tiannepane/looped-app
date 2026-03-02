import { useNavigate, useLocation } from "react-router-dom";
import { Plus, LayoutGrid, User } from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "photo", label: "Sell", icon: Plus, path: "/photo" },
    { id: "dashboard", label: "Items", icon: LayoutGrid, path: "/dashboard" },
    { id: "account", label: "Me", icon: User, path: "/account" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-screen-sm mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center flex-1 h-full transition-colors"
            >
              <Icon 
                className={`w-6 h-6 mb-1 ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span 
                className={`text-xs font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;