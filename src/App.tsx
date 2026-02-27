import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MobileFrame from "./components/MobileFrame";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import PhotoCapture from "./pages/PhotoCapture";
import ItemWhatWhere from "./pages/ItemWhatWhere";
import ItemDetails from "./pages/ItemDetails";
import PricingIntelligence from "./pages/PricingIntelligence";
import PostToPlatforms from "./pages/PostToPlatforms";
import Dashboard from "./pages/Dashboard";
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/photo" element={<PhotoCapture />} />
            <Route path="/description" element={<ItemWhatWhere />} />
            <Route path="/details" element={<ItemDetails />} />
            <Route path="/pricing" element={<PricingIntelligence />} />
            <Route path="/platforms" element={<PostToPlatforms />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MobileFrame>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
