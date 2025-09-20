import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useVoice } from "@/hooks/useVoice";
import { 
  Compass, 
  Scan, 
  Volume2, 
  RotateCcw,
  MapPin,
  Ruler,
  Eye,
  Layers
} from "lucide-react";

interface SceneAnalysis {
  objects: Array<{
    name: string;
    confidence: number;
    position: string;
    distance: number;
    size: string;
  }>;
  scene: {
    lighting: string;
    environment: string;
    safety: string;
    description: string;
  };
  spatial: {
    layout: string;
    pathways: string[];
    obstacles: string[];
  };
}

export default function WhatsAround() {
  const { speak } = useVoice();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [analysis, setAnalysis] = useState<SceneAnalysis | null>(null);

  const mockAnalysis: SceneAnalysis = {
    objects: [
      { name: "Wooden desk", confidence: 95, position: "center-left", distance: 1.2, size: "large" },
      { name: "Office chair", confidence: 88, position: "center", distance: 0.8, size: "medium" },
      { name: "Computer monitor", confidence: 92, position: "center-back", distance: 1.5, size: "medium" },
      { name: "Coffee mug", confidence: 76, position: "right", distance: 1.1, size: "small" },
      { name: "Window", confidence: 89, position: "far-right", distance: 3.2, size: "large" },
      { name: "Bookshelf", confidence: 84, position: "back-left", distance: 2.1, size: "large" },
    ],
    scene: {
      lighting: "Natural lighting from window, well-lit",
      environment: "Indoor office space",
      safety: "Safe - no immediate obstacles or hazards",
      description: "A well-organized office environment with natural lighting. The space appears clean and accessible."
    },
    spatial: {
      layout: "Rectangular room with furniture arranged along walls",
      pathways: ["Clear path from entrance to desk", "Open area near window"],
      obstacles: ["Chair may block direct path to desk", "Low coffee table on right side"]
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setAnalysis(null);
    
    speak("Starting environmental scan. Please hold still while I analyze your surroundings.");

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setAnalysis(mockAnalysis);
          speak("Scan complete. I found several objects and can describe your surroundings.");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const speakFullDescription = () => {
    if (!analysis) return;
    
    const objectList = analysis.objects
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4)
      .map(obj => `${obj.name} at ${obj.distance} meters`)
      .join(", ");
    
    const fullDescription = `
      ${analysis.scene.description} 
      The closest objects are: ${objectList}. 
      ${analysis.scene.safety}
      ${analysis.spatial.pathways.length > 0 ? `Available pathways include: ${analysis.spatial.pathways.join(" and ")}.` : ""}
    `;
    
    speak(fullDescription);
  };

  const speakObject = (object: any) => {
    speak(`${object.name} located ${object.position} at ${object.distance} meters away. Size: ${object.size}. Confidence: ${object.confidence}%.`);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Compass className="h-8 w-8 mr-3 text-primary" />
            What's Around Me
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive environmental analysis and spatial awareness
          </p>
        </div>
        <Button
          onClick={startScan}
          disabled={isScanning}
          className="bg-gradient-eco hover:shadow-eco text-lg px-6 py-3"
        >
          {isScanning ? (
            <RotateCcw className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Scan className="h-5 w-5 mr-2" />
          )}
          {isScanning ? "Scanning..." : "Scan Environment"}
        </Button>
      </div>

      {/* Scanning Progress */}
      {isScanning && (
        <Card className="glass-card border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Environmental Scan in Progress</p>
                    <p className="text-sm text-muted-foreground">Analyzing objects, lighting, and spatial layout</p>
                  </div>
                </div>
                <Badge variant="secondary">{scanProgress}%</Badge>
              </div>
              <Progress value={scanProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scene Overview */}
          <div className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-secondary" />
                  Scene Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Environment</h4>
                  <p className="text-sm text-muted-foreground">{analysis.scene.environment}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Lighting</h4>
                  <p className="text-sm text-muted-foreground">{analysis.scene.lighting}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Safety Assessment</h4>
                  <p className="text-sm text-muted-foreground">{analysis.scene.safety}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={speakFullDescription}
                  className="w-full"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Hear Full Description
                </Button>
              </CardContent>
            </Card>

            {/* Spatial Layout */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-accent" />
                  Spatial Layout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Room Layout</h4>
                  <p className="text-sm text-muted-foreground">{analysis.spatial.layout}</p>
                </div>
                
                {analysis.spatial.pathways.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Available Pathways</h4>
                    <div className="space-y-1">
                      {analysis.spatial.pathways.map((pathway, index) => (
                        <div key={index} className="text-sm text-muted-foreground flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                          {pathway}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.spatial.obstacles.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Potential Obstacles</h4>
                    <div className="space-y-1">
                      {analysis.spatial.obstacles.map((obstacle, index) => (
                        <div key={index} className="text-sm text-muted-foreground flex items-center">
                          <div className="w-2 h-2 bg-emergency rounded-full mr-2" />
                          {obstacle}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detected Objects */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ruler className="h-5 w-5 mr-2 text-primary" />
                Detected Objects ({analysis.objects.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {analysis.objects
                .sort((a, b) => a.distance - b.distance)
                .map((object, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-surface-1 rounded-lg cursor-pointer hover:bg-surface-2 transition-colors"
                    onClick={() => speakObject(object)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{object.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {object.confidence}%
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>📍 {object.position}</span>
                        <span>📏 {object.distance}m</span>
                        <span>📦 {object.size}</span>
                      </div>
                    </div>
                    <Volume2 className="h-4 w-4 text-muted-foreground ml-2" />
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      )}

      {!analysis && !isScanning && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Compass className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Ready to Scan</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start an environmental scan to get a detailed description of your surroundings, 
              including objects, lighting, and spatial layout.
            </p>
            <Button onClick={startScan} className="bg-gradient-eco hover:shadow-eco">
              <Scan className="h-4 w-4 mr-2" />
              Begin Environmental Scan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Voice Commands Help */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Voice Commands</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>• "Scan area" or "What's around me?"</div>
            <div>• "Describe surroundings"</div>
            <div>• "Tell me about the [object]"</div>
          </div>
          <div className="space-y-2">
            <div>• "How far is the [object]?"</div>
            <div>• "What's the closest object?"</div>
            <div>• "Is it safe to walk?"</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}