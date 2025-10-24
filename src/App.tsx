import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { SecurityProvider, useSecurity } from "./contexts/SecurityContext";
import { LockScreen } from "./components/LockScreen";
import { PINSetup } from "./components/PINSetup";
import Index from "./pages/index";
import Insights from "./pages/Insights";
import SavingsVault from "./pages/SavingVault";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const queryClient = new QueryClient();

function AppContent() {
  const { isLocked, isPINSet } = useSecurity();
  const [showPINSetup, setShowPINSetup] = useState(false);

  if (isLocked) {
    return <LockScreen />;
  }

  return (
    <>
      {showPINSetup && <PINSetup onClose={() => setShowPINSetup(false)} />}
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index onOpenPINSetup={() => setShowPINSetup(true)} />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/vault" element={<SavingsVault />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <SecurityProvider>
            <TooltipProvider>
              <AppContent />
            </TooltipProvider>
          </SecurityProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;