import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MobileFrame from "./components/MobileFrame";
import Home from "./pages/Home";
import PhotoCapture from "./pages/PhotoCapture";
import ItemDescription from "./pages/ItemDescription";
import PricingIntelligence from "./pages/PricingIntelligence";
import PlatformSelection from "./pages/PlatformSelection";
import Dashboard from "./pages/Dashboard";
// Inbox removed — out of scope for MVP
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MobileFrame>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/photo" element={<PhotoCapture />} />
            <Route path="/description" element={<ItemDescription />} />
            <Route path="/pricing" element={<PricingIntelligence />} />
            <Route path="/platforms" element={<PlatformSelection />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Inbox route removed — MVP */}
            <Route path="/account" element={<Account />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MobileFrame>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
