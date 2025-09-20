import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Camera, 
  Compass, 
  Navigation as NavigationIcon,
  Phone,
  Users,
  Settings,
  HelpCircle,
  History,
  GraduationCap,
  MessageSquare,
  Shield,
  Menu,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { VoiceButton } from "./VoiceButton";
import { useVoice } from "@/hooks/useVoice";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Camera, label: "Live Vision", path: "/live-vision" },
  { icon: Compass, label: "What's Around Me", path: "/whats-around" },
  { icon: NavigationIcon, label: "Navigation", path: "/navigation" },
  { icon: Phone, label: "Emergency", path: "/emergency", emergency: true },
  { icon: Users, label: "Contacts", path: "/contacts" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Voice Commands", path: "/voice-commands" },
  { icon: History, label: "History", path: "/history" },
  { icon: GraduationCap, label: "Tutorial", path: "/tutorial" },
  { icon: MessageSquare, label: "Feedback", path: "/feedback" },
  { icon: Shield, label: "Admin", path: "/admin" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { isListening, isProcessing, toggleListening } = useVoice();

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50 glass-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Navigation Sidebar */}
      <nav className={cn(
        "fixed left-0 top-0 h-full w-80 bg-card/95 backdrop-blur-xl border-r border-border/50 transition-transform duration-300 z-40",
        "transform-3d shadow-depth",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6">
          {/* Logo & Voice Control */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-eco rounded-xl flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-eco-gradient">Vision AI</h1>
                <p className="text-xs text-muted-foreground">Voice Assistant</p>
              </div>
            </div>
            <VoiceButton
              isListening={isListening}
              isProcessing={isProcessing}
              onToggle={toggleListening}
              size="sm"
            />
          </div>

          {/* Navigation Items */}
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  "hover:bg-surface-1 hover:shadow-sm",
                  isActive && "bg-gradient-eco text-white shadow-eco",
                  item.emergency && !isActive && "hover:bg-emergency/10 hover:text-emergency"
                )}
                onClick={() => setIsOpen(false)}
                aria-label={`Navigate to ${item.label}`}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  "group-hover:scale-110",
                  item.emergency && "text-emergency"
                )} />
                <span className="font-medium">{item.label}</span>
                {item.emergency && (
                  <div className="ml-auto w-2 h-2 bg-emergency rounded-full animate-pulse" />
                )}
              </NavLink>
            ))}
          </div>

          {/* Status Indicator */}
          <div className="mt-8 p-4 bg-surface-1 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Voice Status</span>
              <div className={cn(
                "flex items-center space-x-2 text-sm font-medium",
                isListening && "text-voice-active",
                isProcessing && "text-voice-processing",
                !isListening && !isProcessing && "text-muted-foreground"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isListening && "bg-voice-active animate-pulse",
                  isProcessing && "bg-voice-processing animate-pulse",
                  !isListening && !isProcessing && "bg-muted-foreground"
                )} />
                <span>
                  {isProcessing ? "Processing..." : isListening ? "Listening" : "Ready"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}