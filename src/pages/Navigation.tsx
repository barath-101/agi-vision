import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useVoice } from "@/hooks/useVoice";
import { 
  Navigation as NavigationIcon, 
  MapPin, 
  Route, 
  Compass,
  Clock,
  Map,
  Volume2,
  Target,
  TrendingUp
} from "lucide-react";

interface NavigationStep {
  instruction: string;
  distance: string;
  direction: string;
  landmark?: string;
}

export default function Navigation() {
  const { speak } = useVoice();
  const [destination, setDestination] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Current Location");
  const [route, setRoute] = useState<NavigationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const mockRoute: NavigationStep[] = [
    { instruction: "Head north towards the main entrance", distance: "50 feet", direction: "North", landmark: "Glass doors" },
    { instruction: "Turn right at the reception desk", distance: "20 feet", direction: "East", landmark: "Reception counter" },
    { instruction: "Continue straight down the main corridor", distance: "100 feet", direction: "East", landmark: "Artwork on walls" },
    { instruction: "Turn left at the elevator bank", distance: "30 feet", direction: "North", landmark: "Elevator doors" },
    { instruction: "Your destination is on the right", distance: "15 feet", direction: "East", landmark: "Conference room sign" },
  ];

  const startNavigation = () => {
    if (!destination.trim()) {
      speak("Please enter a destination first.");
      return;
    }

    setRoute(mockRoute);
    setCurrentStep(0);
    setIsNavigating(true);
    speak(`Starting navigation to ${destination}. ${mockRoute[0].instruction}`);
  };

  const nextStep = () => {
    if (currentStep < route.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      speak(route[newStep].instruction);
    } else {
      setIsNavigating(false);
      speak("You have arrived at your destination!");
    }
  };

  const repeatInstruction = () => {
    if (route[currentStep]) {
      speak(route[currentStep].instruction);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        () => {
          setCurrentLocation("Location unavailable");
        }
      );
    }
  }, []);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 bg-gradient-eco rounded-2xl flex items-center justify-center">
            <NavigationIcon className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-eco-gradient">Navigation</h1>
            <p className="text-lg text-muted-foreground">Voice-guided directions and wayfinding</p>
          </div>
        </div>
      </div>

      {/* Current Location */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Current Location</p>
                <p className="text-sm text-muted-foreground">{currentLocation}</p>
              </div>
            </div>
            <Badge variant="secondary">GPS Active</Badge>
          </div>
        </CardContent>
      </Card>

      {!isNavigating ? (
        /* Destination Input */
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-6 w-6 mr-2 text-secondary" />
              Where do you want to go?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter destination (e.g., Conference Room A, Coffee Shop, Exit)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && startNavigation()}
              />
              <Button
                onClick={startNavigation}
                disabled={!destination.trim()}
                className="bg-gradient-eco hover:shadow-eco"
              >
                <Route className="h-4 w-4 mr-2" />
                Start
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["Exit", "Restroom", "Elevator", "Cafeteria"].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setDestination(preset)}
                  className="text-xs"
                >
                  {preset}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Active Navigation */
        <div className="space-y-4">
          {/* Current Instruction */}
          <Card className="glass-card border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="default">Step {currentStep + 1} of {route.length}</Badge>
                    <Badge variant="outline">{route[currentStep].direction}</Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{route[currentStep].instruction}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {route[currentStep].distance}
                    </span>
                    {route[currentStep].landmark && (
                      <span className="flex items-center">
                        <Map className="h-4 w-4 mr-1" />
                        {route[currentStep].landmark}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-16 h-16 bg-gradient-nature rounded-full flex items-center justify-center">
                  <Compass className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={repeatInstruction} variant="outline" className="flex-1">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Repeat
                </Button>
                <Button onClick={nextStep} className="flex-1 bg-gradient-eco hover:shadow-eco">
                  {currentStep === route.length - 1 ? "Arrive" : "Next Step"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Route Progress */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Route className="h-5 w-5 mr-2 text-accent" />
                Route Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {route.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    index === currentStep ? "bg-primary/10 border border-primary/20" :
                    index < currentStep ? "bg-secondary/10 border border-secondary/20" :
                    "bg-surface-1"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === currentStep ? "bg-primary text-white" :
                    index < currentStep ? "bg-secondary text-white" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${index === currentStep ? "font-medium" : ""}`}>
                      {step.instruction}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.distance} • {step.direction}
                    </p>
                  </div>
                  {index < currentStep && (
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                      <Clock className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stop Navigation */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <Button
                onClick={() => {
                  setIsNavigating(false);
                  setRoute([]);
                  setCurrentStep(0);
                  speak("Navigation stopped.");
                }}
                variant="destructive"
                className="w-full"
              >
                Stop Navigation
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Voice Commands */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Navigation Voice Commands</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>• "Navigate to [location]"</div>
            <div>• "Take me to the exit"</div>
            <div>• "Where am I?"</div>
            <div>• "Repeat instruction"</div>
          </div>
          <div className="space-y-2">
            <div>• "Next step"</div>
            <div>• "Stop navigation"</div>
            <div>• "How far to destination?"</div>
            <div>• "What's my current location?"</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}