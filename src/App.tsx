import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import LiveVision from "./pages/LiveVision";
import WhatsAround from "./pages/WhatsAround";
import Navigation from "./pages/Navigation";
import Emergency from "./pages/Emergency";
import Contacts from "./pages/Contacts";
import Settings from "./pages/Settings";
import VoiceCommands from "./pages/VoiceCommands";
import History from "./pages/History";
import Tutorial from "./pages/Tutorial";
import Feedback from "./pages/Feedback";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="live-vision" element={<LiveVision />} />
            <Route path="whats-around" element={<WhatsAround />} />
            <Route path="navigation" element={<Navigation />} />
            <Route path="emergency" element={<Emergency />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="settings" element={<Settings />} />
            <Route path="voice-commands" element={<VoiceCommands />} />
            <Route path="history" element={<History />} />
            <Route path="tutorial" element={<Tutorial />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
