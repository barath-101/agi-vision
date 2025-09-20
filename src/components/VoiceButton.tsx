import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onToggle: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VoiceButton({ 
  isListening, 
  isProcessing, 
  onToggle, 
  className,
  size = "md" 
}: VoiceButtonProps) {
  const sizeClasses = {
    sm: "h-10 w-10 text-sm",
    md: "h-16 w-16 text-lg", 
    lg: "h-20 w-20 text-xl"
  };

  return (
    <Button
      onClick={onToggle}
      disabled={isProcessing}
      className={cn(
        "rounded-full transition-all duration-300 relative overflow-hidden",
        sizeClasses[size],
        isListening && "voice-listening animate-pulse-glow",
        isProcessing && "voice-processing animate-voice-process",
        !isListening && !isProcessing && "bg-gradient-eco hover:shadow-glow",
        className
      )}
      aria-label={isListening ? "Stop listening" : "Start voice command"}
    >
      {isProcessing ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : isListening ? (
        <MicOff className="h-6 w-6" />
      ) : (
        <Mic className="h-6 w-6" />
      )}
      
      {isListening && (
        <div className="absolute inset-0 rounded-full animate-ping bg-voice-active/30" />
      )}
    </Button>
  );
}