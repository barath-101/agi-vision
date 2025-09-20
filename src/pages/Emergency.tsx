import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVoice } from "@/hooks/useVoice";
import { toast } from "@/hooks/use-toast";
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  User, 
  Clock,
  AlertTriangle,
  Heart,
  Shield,
  Zap
} from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  isPrimary: boolean;
}

const emergencyContacts: EmergencyContact[] = [
  { id: "1", name: "Dr. Sarah Johnson", phone: "+1-555-0123", relation: "Doctor", isPrimary: true },
  { id: "2", name: "Mike Chen", phone: "+1-555-0124", relation: "Family", isPrimary: true },
  { id: "3", name: "Emergency Services", phone: "911", relation: "Emergency", isPrimary: true },
  { id: "4", name: "Lisa Park", phone: "+1-555-0125", relation: "Friend", isPrimary: false },
];

export default function Emergency() {
  const { speak } = useVoice();
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    speak("Emergency interface opened. Say 'call emergency' or select a contact to call or message.");
  }, [speak]);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setIsGettingLocation(false);
          speak(`Location found: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          toast({
            title: "Location Retrieved",
            description: "Your current location has been captured and is ready to share.",
          });
        },
        (error) => {
          setIsGettingLocation(false);
          speak("Could not get location. Please enable location services.");
          toast({
            title: "Location Error",
            description: "Could not access your location. Please check permissions.",
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsGettingLocation(false);
      speak("Location services not available on this device.");
    }
  };

  const makeCall = (contact: EmergencyContact) => {
    speak(`Calling ${contact.name} at ${contact.phone}`);
    // In a real app, this would use WebRTC or native calling
    window.open(`tel:${contact.phone}`);
    toast({
      title: "Initiating Call",
      description: `Calling ${contact.name}...`,
    });
  };

  const sendMessage = (contact: EmergencyContact) => {
    const message = `Emergency: I need assistance. My current time is ${currentTime.toLocaleString()}.${location ? ` My location is: https://maps.google.com/?q=${location.lat},${location.lon}` : ' Location not available.'}`;
    
    speak(`Sending emergency message to ${contact.name}`);
    // In a real app, this would send SMS via API
    navigator.clipboard.writeText(message);
    
    toast({
      title: "Message Prepared",
      description: `Emergency message copied to clipboard for ${contact.name}`,
    });
  };

  const quickEmergencyCall = () => {
    speak("Calling emergency services now!");
    window.open("tel:911");
    toast({
      title: "Emergency Call",
      description: "Calling 911...",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Emergency Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 bg-emergency rounded-2xl flex items-center justify-center animate-emergency-pulse">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-emergency">Emergency</h1>
            <p className="text-lg text-muted-foreground">Quick access to help and support</p>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Current Time: {currentTime.toLocaleString()}
        </div>
      </div>

      {/* Quick Emergency Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={quickEmergencyCall}
          className="h-20 bg-emergency hover:bg-emergency/90 text-white text-lg font-semibold animate-emergency-pulse"
        >
          <Phone className="h-6 w-6 mr-2" />
          Call 911
        </Button>
        
        <Button
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="h-20 bg-gradient-eco hover:shadow-eco text-lg font-semibold"
        >
          {isGettingLocation ? (
            <Clock className="h-6 w-6 mr-2 animate-spin" />
          ) : (
            <MapPin className="h-6 w-6 mr-2" />
          )}
          {isGettingLocation ? "Getting Location..." : "Share Location"}
        </Button>
        
        <Button
          onClick={() => location && sendMessage(emergencyContacts[1])}
          disabled={!location}
          className="h-20 bg-gradient-nature hover:shadow-nature text-lg font-semibold"
        >
          <MessageSquare className="h-6 w-6 mr-2" />
          Send Alert
        </Button>
      </div>

      {/* Location Status */}
      {location && (
        <Card className="glass-card border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Location Ready</p>
                  <p className="text-sm text-muted-foreground">
                    {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://maps.google.com/?q=${location.lat},${location.lon}`)}
              >
                View on Map
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Contacts */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-6 w-6 mr-2 text-primary" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-4 bg-surface-1 rounded-lg hover:bg-surface-2 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${contact.relation === 'Emergency' ? 'bg-emergency' : 
                    contact.isPrimary ? 'bg-primary' : 'bg-secondary'}
                `}>
                  {contact.relation === 'Emergency' ? (
                    <Shield className="h-5 w-5 text-white" />
                  ) : contact.relation === 'Doctor' ? (
                    <Heart className="h-5 w-5 text-white" />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{contact.name}</p>
                    {contact.isPrimary && (
                      <Badge variant="secondary" className="text-xs">Primary</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {contact.relation} • {contact.phone}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => makeCall(contact)}
                  className="hover:bg-primary hover:text-white"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(contact)}
                  disabled={!location}
                  className="hover:bg-secondary hover:text-white"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Voice Commands */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-6 w-6 mr-2 text-accent" />
            Emergency Voice Commands
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>• "Call emergency"</div>
            <div>• "Call [contact name]"</div>
            <div>• "Emergency call"</div>
          </div>
          <div className="space-y-2">
            <div>• "Send emergency message"</div>
            <div>• "Share my location"</div>
            <div>• "Where am I?"</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}