import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VoiceButton } from "@/components/VoiceButton";
import { useVoice } from "@/hooks/useVoice";
import { 
  Camera, 
  Compass, 
  Navigation, 
  Phone, 
  Users, 
  Settings,
  Sparkles,
  Zap,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";

const quickActions = [
  { icon: Camera, label: "Live Vision", path: "/live-vision", description: "See what's around you" },
  { icon: Compass, label: "Scan Area", path: "/whats-around", description: "Describe surroundings" },
  { icon: Navigation, label: "Navigate", path: "/navigation", description: "Get directions" },
  { icon: Phone, label: "Emergency", path: "/emergency", description: "Quick help access", emergency: true },
];

const features = [
  { icon: Sparkles, title: "AI-Powered Vision", description: "Advanced object detection and scene understanding" },
  { icon: Zap, title: "Voice-First Design", description: "Complete hands-free operation with natural voice commands" },
  { icon: Shield, title: "Emergency Ready", description: "Instant access to emergency contacts and location sharing" },
];

export default function Home() {
  const { isListening, isProcessing, toggleListening, speak } = useVoice();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Welcome message on first load
    const hasVisited = localStorage.getItem('vision-ai-visited');
    if (!hasVisited) {
      setTimeout(() => {
        speak("Welcome to Vision AI. Your voice-controlled assistant for visual accessibility. Say 'voice commands' to learn what I can do.");
        localStorage.setItem('vision-ai-visited', 'true');
      }, 1000);
    }
  }, [speak]);

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-50 animate-float" />
        <Card className="glass-card border-0 relative">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-eco rounded-2xl flex items-center justify-center animate-pulse-glow">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-eco-gradient">Vision AI</h1>
                <p className="text-lg text-muted-foreground">Your Voice-First Visual Assistant</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-2xl font-semibold mb-2">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-muted-foreground">
                {currentTime.toLocaleDateString([], { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <VoiceButton
                isListening={isListening}
                isProcessing={isProcessing}
                onToggle={toggleListening}
                size="lg"
                className="shadow-glow"
              />
            </div>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started by saying "What can you do?" or tap the microphone button above. 
              Navigate entirely with your voice or use touch controls.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Zap className="h-6 w-6 mr-2 text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={action.path} to={action.path}>
              <Card className={`
                glass-card hover:shadow-eco transition-all duration-300 cursor-pointer group
                ${action.emergency ? 'hover:shadow-emergency-glow border-emergency/20' : ''}
                animate-scale-in
              `} style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6 text-center">
                  <div className={`
                    w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center
                    transition-all duration-300 group-hover:scale-110
                    ${action.emergency ? 'bg-emergency/10' : 'bg-gradient-eco'}
                  `}>
                    <action.icon className={`h-6 w-6 ${action.emergency ? 'text-emergency' : 'text-white'}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{action.label}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-secondary" />
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={feature.title} className="glass-card animate-slide-right" 
                  style={{ animationDelay: `${index * 150}ms` }}>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-nature rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Voice Status */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Voice Assistant Status</h3>
              <p className="text-sm text-muted-foreground">
                {isProcessing ? "Processing your command..." : 
                 isListening ? "Listening for commands..." : 
                 "Ready for voice commands"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${isListening ? 'bg-voice-active animate-pulse' : 
                  isProcessing ? 'bg-voice-processing animate-pulse' : 
                  'bg-muted-foreground'}
              `} />
              <Button variant="outline" size="sm" onClick={() => speak("Voice assistant is ready")}>
                Test Voice
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}