import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export interface VoiceCommand {
  patterns: string[];
  action: string;
  description: string;
  category: "navigation" | "emergency" | "detection" | "settings" | "general";
}

const voiceCommands: VoiceCommand[] = [
  // Navigation commands
  { patterns: ["go home", "open home", "home page"], action: "navigate:/", description: "Go to home page", category: "navigation" },
  { patterns: ["open live vision", "start camera", "live vision"], action: "navigate:/live-vision", description: "Open live vision camera", category: "navigation" },
  { patterns: ["what's around me", "describe surroundings", "scan area"], action: "navigate:/whats-around", description: "Scan surrounding area", category: "navigation" },
  { patterns: ["open navigation", "navigate", "directions"], action: "navigate:/navigation", description: "Open navigation", category: "navigation" },
  { patterns: ["emergency", "help", "call for help"], action: "navigate:/emergency", description: "Open emergency options", category: "emergency" },
  { patterns: ["open contacts", "show contacts", "my contacts"], action: "navigate:/contacts", description: "Open contacts list", category: "navigation" },
  { patterns: ["open settings", "change settings", "preferences"], action: "navigate:/settings", description: "Open settings", category: "navigation" },
  { patterns: ["voice commands", "help commands", "what can you do"], action: "navigate:/voice-commands", description: "Show voice commands list", category: "navigation" },
  { patterns: ["show history", "previous interactions", "history"], action: "navigate:/history", description: "Show interaction history", category: "navigation" },
  { patterns: ["start tutorial", "how to use", "tutorial"], action: "navigate:/tutorial", description: "Start tutorial mode", category: "navigation" },
  
  // Emergency commands
  { patterns: ["call emergency", "emergency call", "call 911"], action: "emergency:call", description: "Make emergency call", category: "emergency" },
  { patterns: ["send emergency message", "text for help", "emergency text"], action: "emergency:message", description: "Send emergency message", category: "emergency" },
  { patterns: ["share my location", "send location", "where am i"], action: "emergency:location", description: "Share current location", category: "emergency" },
  
  // Detection commands
  { patterns: ["what do you see", "describe this", "tell me what's there"], action: "detect:scene", description: "Describe current scene", category: "detection" },
  { patterns: ["find objects", "what objects", "identify items"], action: "detect:objects", description: "Identify objects in view", category: "detection" },
  { patterns: ["read text", "what does it say", "read this"], action: "detect:text", description: "Read text in view", category: "detection" },
  { patterns: ["how far", "distance", "depth"], action: "detect:depth", description: "Measure distance to objects", category: "detection" },
  
  // Settings commands
  { patterns: ["change voice to male", "male voice"], action: "settings:voice:male", description: "Change to male voice", category: "settings" },
  { patterns: ["change voice to female", "female voice"], action: "settings:voice:female", description: "Change to female voice", category: "settings" },
  { patterns: ["increase volume", "louder", "volume up"], action: "settings:volume:up", description: "Increase volume", category: "settings" },
  { patterns: ["decrease volume", "quieter", "volume down"], action: "settings:volume:down", description: "Decrease volume", category: "settings" },
];

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        setTranscript(transcript);
        processVoiceCommand(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        setIsProcessing(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not process voice command. Please try again.",
          variant: "destructive",
        });
      };
    }
  }, []);

  const processVoiceCommand = useCallback((transcript: string) => {
    setIsProcessing(true);
    
    // Find matching command
    const matchedCommand = voiceCommands.find(cmd => 
      cmd.patterns.some(pattern => 
        transcript.includes(pattern) || 
        pattern.split(' ').every(word => transcript.includes(word))
      )
    );

    if (matchedCommand) {
      const [actionType, ...actionParams] = matchedCommand.action.split(':');
      
      switch (actionType) {
        case 'navigate':
          navigate(actionParams[0]);
          speak(`Opening ${matchedCommand.description.toLowerCase()}`);
          break;
        case 'emergency':
          handleEmergencyAction(actionParams[0]);
          break;
        case 'detect':
          handleDetectionAction(actionParams[0]);
          break;
        case 'settings':
          handleSettingsAction(actionParams);
          break;
        default:
          speak("Command recognized but not implemented yet.");
      }
      
      toast({
        title: "Voice Command Executed",
        description: matchedCommand.description,
      });
    } else {
      speak("Sorry, I didn't understand that command. Try saying 'voice commands' to see what I can do.");
      toast({
        title: "Command Not Recognized",
        description: "Try saying 'voice commands' to see available options.",
        variant: "destructive",
      });
    }
    
    setIsProcessing(false);
  }, [navigate]);

  const handleEmergencyAction = (action: string) => {
    switch (action) {
      case 'call':
        speak("Opening emergency calling interface");
        navigate('/emergency');
        break;
      case 'message':
        speak("Opening emergency messaging interface");
        navigate('/emergency');
        break;
      case 'location':
        speak("Sharing your current location");
        // Implement location sharing
        break;
    }
  };

  const handleDetectionAction = (action: string) => {
    switch (action) {
      case 'scene':
        speak("Analyzing the scene in front of you");
        navigate('/live-vision');
        break;
      case 'objects':
        speak("Identifying objects in your view");
        navigate('/live-vision');
        break;
      case 'text':
        speak("Reading text in the view");
        navigate('/live-vision');
        break;
      case 'depth':
        speak("Measuring distances to objects");
        navigate('/live-vision');
        break;
    }
  };

  const handleSettingsAction = (params: string[]) => {
    if (params[0] === 'voice') {
      speak(`Changing voice to ${params[1]}`);
      navigate('/settings');
    } else if (params[0] === 'volume') {
      speak(params[1] === 'up' ? 'Increasing volume' : 'Decreasing volume');
      navigate('/settings');
    }
  };

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  }, [isListening]);

  return {
    isListening,
    isProcessing,
    transcript,
    toggleListening,
    speak,
    voiceCommands,
  };
}