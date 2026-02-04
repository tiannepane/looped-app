import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";

const menuItems = [
  { icon: User, label: "Profile Settings", description: "Manage your account" },
  { icon: Settings, label: "App Settings", description: "Notifications, privacy" },
  { icon: HelpCircle, label: "Help & Support", description: "FAQ, contact us" },
  { icon: LogOut, label: "Sign Out", description: "Log out of your account" },
];

const Account = () => {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 flex items-center px-4 bg-background border-b border-border">
        <h1 className="text-lg font-bold text-foreground">Account</h1>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          {/* Profile card */}
          <Card className="p-4 flex items-center gap-4 bg-card border-border">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Demo User</h2>
              <p className="text-sm text-muted-foreground">demo@looped.app</p>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center bg-card border-border">
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </Card>
            <Card className="p-4 text-center bg-card border-border">
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Sold</p>
            </Card>
            <Card className="p-4 text-center bg-card border-border">
              <p className="text-2xl font-bold text-primary">$2,340</p>
              <p className="text-xs text-muted-foreground">Earned</p>
            </Card>
          </div>

          {/* Menu items */}
          <div className="space-y-2 pt-2">
            {menuItems.map((item) => (
              <Card
                key={item.label}
                className="p-4 flex items-center gap-4 bg-card border-border cursor-pointer hover:bg-accent transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Account;
