import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVoice } from "@/hooks/useVoice";
import { 
  HelpCircle, 
  Search, 
  Volume2, 
  Navigation, 
  Phone, 
  Eye, 
  Settings as SettingsIcon,
  Mic
} from "lucide-react";

const commandCategories = [
  {
    name: "Navigation",
    icon: Navigation,
    color: "bg-primary",
    commands: [
      { phrase: "Go home", description: "Navigate to home page", example: "Go home" },
      { phrase: "Open live vision", description: "Start camera for object detection", example: "Open live vision" },
      { phrase: "What's around me", description: "Scan environment for objects", example: "What's around me?" },
      { phrase: "Open navigation", description: "Get directions and navigation help", example: "Open navigation" },
      { phrase: "Show contacts", description: "View emergency contacts", example: "Show contacts" },
      { phrase: "Open settings", description: "Access app preferences", example: "Open settings" },
      { phrase: "Voice commands", description: "Show this help page", example: "Voice commands" },
      { phrase: "Show history", description: "View interaction history", example: "Show history" },
    ]
  },
  {
    name: "Emergency",
    icon: Phone,
    color: "bg-emergency",
    commands: [
      { phrase: "Emergency", description: "Open emergency interface", example: "Emergency" },
      { phrase: "Call emergency", description: "Call emergency services", example: "Call emergency" },
      { phrase: "Call [contact name]", description: "Call a specific contact", example: "Call Dr. Johnson" },
      { phrase: "Send emergency message", description: "Send SOS text message", example: "Send emergency message" },
      { phrase: "Share my location", description: "Share GPS coordinates", example: "Share my location" },
      { phrase: "Where am I", description: "Get current location info", example: "Where am I?" },
    ]
  },
  {
    name: "Vision & Detection",
    icon: Eye,
    color: "bg-secondary",
    commands: [
      { phrase: "What do you see", description: "Describe current camera view", example: "What do you see?" },
      { phrase: "Describe this", description: "Analyze and describe scene", example: "Describe this scene" },
      { phrase: "Find objects", description: "Identify objects in view", example: "Find objects" },
      { phrase: "Read text", description: "Read text in camera view", example: "Read text" },
      { phrase: "How far", description: "Measure distance to objects", example: "How far is the chair?" },
      { phrase: "What's that", description: "Identify specific object", example: "What's that in front of me?" },
      { phrase: "Scan area", description: "Comprehensive environment scan", example: "Scan area" },
    ]
  },
  {
    name: "Settings & Preferences",
    icon: SettingsIcon,
    color: "bg-accent",
    commands: [
      { phrase: "Change voice to male", description: "Switch to male voice", example: "Change voice to male" },
      { phrase: "Change voice to female", description: "Switch to female voice", example: "Change voice to female" },
      { phrase: "Volume up", description: "Increase system volume", example: "Volume up" },
      { phrase: "Volume down", description: "Decrease system volume", example: "Volume down" },
      { phrase: "Repeat", description: "Repeat last response", example: "Repeat that" },
      { phrase: "Stop", description: "Stop current voice output", example: "Stop" },
    ]
  }
];

export default function VoiceCommands() {
  const { speak } = useVoice();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = commandCategories.map(category => ({
    ...category,
    commands: category.commands.filter(cmd =>
      cmd.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.commands.length > 0);

  const displayCategories = selectedCategory
    ? filteredCategories.filter(cat => cat.name === selectedCategory)
    : filteredCategories;

  const speakCommand = (command: any) => {
    speak(`${command.phrase}. ${command.description}. Example: ${command.example}`);
  };

  const speakCategoryIntro = (category: any) => {
    speak(`${category.name} commands. This category contains ${category.commands.length} voice commands for ${category.name.toLowerCase()} functions.`);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 bg-gradient-eco rounded-2xl flex items-center justify-center">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-eco-gradient">Voice Commands</h1>
            <p className="text-lg text-muted-foreground">Complete guide to voice interactions</p>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore all available voice commands. Tap any command to hear an example, 
          or say "help" followed by a category name for specific guidance.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search commands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            size="sm"
          >
            All Categories
          </Button>
          {commandCategories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "outline"}
              onClick={() => setSelectedCategory(
                selectedCategory === category.name ? null : category.name
              )}
              size="sm"
              className="flex items-center space-x-1"
            >
              <category.icon className="h-3 w-3" />
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Command Categories */}
      <div className="space-y-6">
        {displayCategories.map((category, categoryIndex) => (
          <Card key={category.name} className="glass-card animate-scale-in" 
                style={{ animationDelay: `${categoryIndex * 100}ms` }}>
            <CardHeader className="cursor-pointer" onClick={() => speakCategoryIntro(category)}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${category.color} rounded-xl flex items-center justify-center`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl">{category.name}</h3>
                    <p className="text-sm text-muted-foreground font-normal">
                      {category.commands.length} commands available
                    </p>
                  </div>
                </div>
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.commands.map((command, commandIndex) => (
                <div
                  key={commandIndex}
                  className="flex items-center justify-between p-4 bg-surface-1 rounded-lg hover:bg-surface-2 transition-colors cursor-pointer group"
                  onClick={() => speakCommand(command)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        "{command.phrase}"
                      </Badge>
                      <Mic className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground">{command.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">Example:</span> "{command.example}"
                    </p>
                  </div>
                  <Volume2 className="h-4 w-4 text-muted-foreground ml-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Commands Found</h3>
            <p className="text-muted-foreground mb-4">
              No voice commands match your search. Try different keywords or browse all categories.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Voice Command Tips</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>• Speak clearly and at normal pace</div>
            <div>• Wait for the listening indicator</div>
            <div>• Use natural language variations</div>
            <div>• Commands work in any order</div>
          </div>
          <div className="space-y-2">
            <div>• Say "stop" to interrupt speech</div>
            <div>• Say "repeat" to hear again</div>
            <div>• Background noise may affect accuracy</div>
            <div>• Enable microphone permissions</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}