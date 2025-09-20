import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useVoice } from "@/hooks/useVoice";
import { 
  GraduationCap, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  CheckCircle,
  Circle,
  Volume2,
  Mic,
  Eye,
  Navigation,
  Phone
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  voiceInstruction: string;
  action?: string;
  tips: string[];
  category: "basics" | "vision" | "navigation" | "emergency" | "advanced";
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "1",
    title: "Welcome to Vision AI",
    description: "Learn how to use your voice-controlled visual assistant",
    voiceInstruction: "Welcome to Vision AI! This tutorial will teach you how to use all the features. You can control everything with your voice or touch. Let's start!",
    category: "basics",
    tips: [
      "Speak clearly and at normal pace",
      "Wait for the listening indicator",
      "Use natural language"
    ]
  },
  {
    id: "2",
    title: "Voice Commands Basics",
    description: "Learn how to activate and use voice commands",
    voiceInstruction: "To use voice commands, tap the microphone button or say 'Hey Vision'. Try saying 'What can you do?' to hear available commands.",
    action: "voice_demo",
    category: "basics",
    tips: [
      "The button glows when listening",
      "Say 'stop' to interrupt",
      "Say 'repeat' to hear again"
    ]
  },
  {
    id: "3",
    title: "Starting Live Vision",
    description: "Learn how to use the camera for object detection",
    voiceInstruction: "Say 'Open live vision' or 'Start camera' to begin seeing what's around you. The camera will show detected objects with colored boxes.",
    action: "open_live_vision",
    category: "vision",
    tips: [
      "Allow camera permissions",
      "Point camera at objects",
      "Tap objects to hear details"
    ]
  },
  {
    id: "4",
    title: "Scene Analysis",
    description: "Get detailed descriptions of your surroundings",
    voiceInstruction: "Say 'What's around me?' or 'Describe this scene' to get a comprehensive description of your environment and all visible objects.",
    action: "scene_analysis",
    category: "vision",
    tips: [
      "Hold camera steady",
      "Good lighting helps accuracy",
      "Processing takes a few seconds"
    ]
  },
  {
    id: "5",
    title: "Navigation Assistance",
    description: "Learn how to get directions and navigate",
    voiceInstruction: "Say 'Navigate to the exit' or 'Take me to the restroom' to get step-by-step voice directions to your destination.",
    action: "navigation_demo",
    category: "navigation",
    tips: [
      "Enable location services",
      "Speak destination clearly",
      "Follow voice instructions"
    ]
  },
  {
    id: "6",
    title: "Emergency Features",
    description: "Access emergency contacts and services quickly",
    voiceInstruction: "In an emergency, say 'Emergency' or 'Call for help' to quickly access emergency contacts and services. Your location can be shared automatically.",
    action: "emergency_demo",
    category: "emergency",
    tips: [
      "Set up emergency contacts first",
      "Location sharing helps responders",
      "Practice commands when calm"
    ]
  },
  {
    id: "7",
    title: "Customizing Settings",
    description: "Personalize your Vision AI experience",
    voiceInstruction: "Say 'Open settings' to customize voice speed, volume, and accessibility features. You can change the voice gender and language too.",
    action: "settings_demo",
    category: "advanced",
    tips: [
      "Test voice changes immediately",
      "Adjust for your preferences",
      "Save important settings"
    ]
  },
  {
    id: "8",
    title: "Practice Session",
    description: "Try out what you've learned",
    voiceInstruction: "Now try using some commands on your own! Say 'What can you do?' to see all options, or try 'Show my contacts' or 'What do you see?'",
    action: "practice",
    category: "advanced",
    tips: [
      "Don't worry about mistakes",
      "Experiment with different phrases",
      "Ask for help anytime"
    ]
  }
];

export default function Tutorial() {
  const { speak } = useVoice();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);

  const getCurrentStep = () => tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vision": return Eye;
      case "navigation": return Navigation;
      case "emergency": return Phone;
      case "advanced": return GraduationCap;
      default: return Mic;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "vision": return "bg-primary";
      case "navigation": return "bg-secondary";
      case "emergency": return "bg-emergency";
      case "advanced": return "bg-accent";
      default: return "bg-muted-foreground";
    }
  };

  const playStep = () => {
    const step = getCurrentStep();
    speak(step.voiceInstruction);
    setIsPlaying(true);
    
    // Simulate voice duration
    setTimeout(() => {
      setIsPlaying(false);
    }, step.voiceInstruction.length * 50);
  };

  const nextStep = () => {
    const currentStepData = getCurrentStep();
    setCompletedSteps(prev => new Set(prev).add(currentStepData.id));
    
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimeout(() => {
        playStep();
      }, 500);
    } else {
      speak("Congratulations! You've completed the Vision AI tutorial. You're ready to explore all features!");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const resetTutorial = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setIsPlaying(false);
    speak("Tutorial reset. Starting from the beginning.");
  };

  const step = getCurrentStep();
  const IconComponent = getCategoryIcon(step.category);
  const colorClass = getCategoryColor(step.category);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 bg-gradient-eco rounded-2xl flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-eco-gradient">Tutorial</h1>
            <p className="text-lg text-muted-foreground">Learn to use Vision AI step by step</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Progress</h3>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {tutorialSteps.length}
              </p>
            </div>
            <Badge variant="secondary">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Step */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <p className="text-sm text-muted-foreground capitalize">{step.category} tutorial</p>
                  </div>
                </div>
                <Badge variant="outline">
                  {currentStep + 1}/{tutorialSteps.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{step.description}</p>
              
              {/* Voice Instruction */}
              <div className="bg-surface-1 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium flex items-center">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Voice Instruction
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={playStep}
                    disabled={isPlaying}
                  >
                    {isPlaying ? (
                      <Pause className="h-3 w-3 mr-1" />
                    ) : (
                      <Play className="h-3 w-3 mr-1" />
                    )}
                    {isPlaying ? "Playing..." : "Play"}
                  </Button>
                </div>
                <p className="text-sm italic">"{step.voiceInstruction}"</p>
              </div>

              {/* Tips */}
              <div>
                <h4 className="font-medium mb-3">Tips for this step:</h4>
                <div className="space-y-2">
                  {step.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex-1"
                >
                  <SkipBack className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1 bg-gradient-eco hover:shadow-eco"
                >
                  {currentStep === tutorialSteps.length - 1 ? "Complete" : "Next"}
                  <SkipForward className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Overview */}
        <div className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Tutorial Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {tutorialSteps.map((tutorialStep, index) => {
                const StepIcon = getCategoryIcon(tutorialStep.category);
                const isCompleted = completedSteps.has(tutorialStep.id);
                const isCurrent = index === currentStep;
                
                return (
                  <div
                    key={tutorialStep.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isCurrent ? "bg-primary/10 border border-primary/20" :
                      isCompleted ? "bg-secondary/10 border border-secondary/20" :
                      "hover:bg-surface-1"
                    }`}
                    onClick={() => goToStep(index)}
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-secondary" />
                      ) : isCurrent ? (
                        <Circle className="h-5 w-5 text-primary fill-current" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <StepIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${isCurrent ? "text-primary" : ""}`}>
                          {tutorialStep.title}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {tutorialStep.category}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Tutorial Controls */}
          <Card className="glass-card">
            <CardContent className="p-4 space-y-3">
              <Button variant="outline" onClick={resetTutorial} className="w-full">
                Restart Tutorial
              </Button>
              <div className="text-center text-xs text-muted-foreground">
                You can exit the tutorial anytime and resume later
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Voice Commands */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Tutorial Voice Commands</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>• "Start tutorial"</div>
            <div>• "Next step"</div>
            <div>• "Previous step"</div>
            <div>• "Repeat instruction"</div>
          </div>
          <div className="space-y-2">
            <div>• "Play this step"</div>
            <div>• "Skip to [step name]"</div>
            <div>• "Restart tutorial"</div>
            <div>• "Exit tutorial"</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}