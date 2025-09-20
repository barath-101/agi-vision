import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { VoiceButton } from "./VoiceButton";
import { useVoice } from "@/hooks/useVoice";

export function Layout() {
  const { isListening, isProcessing, toggleListening } = useVoice();

  return (
    <div className="min-h-screen bg-gradient-depth">
      <Navigation />
      
      {/* Main Content */}
      <main className="md:ml-80 min-h-screen relative">
        <div className="p-6 pt-20 md:pt-6">
          <Outlet />
        </div>
        
        {/* Floating Voice Button */}
        <div className="fixed bottom-6 right-6 z-30">
          <VoiceButton
            isListening={isListening}
            isProcessing={isProcessing}
            onToggle={toggleListening}
            size="lg"
            className="shadow-depth hover:shadow-glow"
          />
        </div>
      </main>
    </div>
  );
}