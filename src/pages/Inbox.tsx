import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ScreenHeader from "@/components/ScreenHeader";
import BottomNav from "@/components/BottomNav";
import { fakeMessages, ListingItem, Message } from "@/lib/fakeData";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const platformIcons: Record<string, string> = {
  facebook: "📘",
  kijiji: "🟣",
  carrot: "🥕",
};

const platformColors: Record<string, string> = {
  facebook: "bg-blue-100 text-blue-700",
  kijiji: "bg-purple-100 text-purple-700",
  carrot: "bg-orange-100 text-orange-700",
};

const Inbox = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [reply, setReply] = useState("");
  const [showSoldDialog, setShowSoldDialog] = useState(false);
  const [listing, setListing] = useState<ListingItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Get listing from sessionStorage or use default
    const stored = sessionStorage.getItem("currentListing");
    if (stored) {
      setListing(JSON.parse(stored));
    }
    // Get messages for this listing
    if (id && fakeMessages[id]) {
      setMessages(fakeMessages[id]);
    }
  }, [id]);

  const handleSendReply = () => {
    if (reply.trim()) {
      toast({
        title: "Reply sent!",
        description: "Your message has been sent to the buyer.",
      });
      setReply("");
    }
  };

  const handleMarkAsSold = () => {
    setShowSoldDialog(false);
    const earnings = listing ? Math.round(listing.price * 0.95) : 0;
    const fee = listing ? Math.round(listing.price * 0.05) : 0;
    toast({
      title: "Item marked as sold! 🎉",
      description: `You earned $${earnings} (after $${fee} Looped fee)`,
    });
    // Pass sold info to dashboard
    navigate("/dashboard", {
      state: {
        soldItem: {
          id: listing?.id,
          soldPrice: listing?.price,
        }
      }
    });
  };

  if (!listing) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader
        title="Messages"
        rightElement={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSoldDialog(true)}
            className="text-xs text-success font-semibold hover:bg-success/10"
          >
            Sold
          </Button>
        }
      />

      {/* Item header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h2 className="font-semibold text-foreground">{listing.title}</h2>
            <p className="text-primary font-bold">${listing.price}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-36">
        <div className="p-4 space-y-3">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={cn(
                "p-4 bg-card border-border",
                !message.isRead && "border-l-4 border-l-primary"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {message.buyerName}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      platformColors[message.platform]
                    )}
                  >
                    {platformIcons[message.platform]} {message.platform.charAt(0).toUpperCase() + message.platform.slice(1)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp}
                </span>
              </div>
              <p className="text-sm text-foreground">{message.message}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Reply input */}
      <div className="absolute bottom-20 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Type a reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="flex-1 h-12 rounded-xl"
            onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
          />
          <Button
            onClick={handleSendReply}
            disabled={!reply.trim()}
            size="icon"
            className="w-12 h-12 rounded-xl"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <BottomNav />

      {/* Sold confirmation dialog */}
      <AlertDialog open={showSoldDialog} onOpenChange={setShowSoldDialog}>
        <AlertDialogContent className="max-w-[340px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Sold?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{listing.title}" from all platforms and notify
              interested buyers that it's no longer available.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMarkAsSold}
              className="rounded-xl bg-success hover:bg-success/90"
            >
              Mark as Sold
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Inbox;
