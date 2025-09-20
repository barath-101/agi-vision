import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVoice } from "@/hooks/useVoice";
import { 
  Camera, 
  CameraOff, 
  Scan, 
  Eye, 
  MessageSquare,
  Volume2,
  RotateCcw,
  Zap
} from "lucide-react";

interface Detection {
  id: string;
  label: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  distance?: number;
}

export default function LiveVision() {
  const { speak } = useVoice();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastDescription, setLastDescription] = useState("");

  // Mock detections for demo
  const mockDetections: Detection[] = [
    { id: "1", label: "Person", confidence: 0.95, bbox: { x: 100, y: 50, width: 120, height: 200 }, distance: 2.5 },
    { id: "2", label: "Chair", confidence: 0.87, bbox: { x: 300, y: 150, width: 80, height: 100 }, distance: 1.8 },
    { id: "3", label: "Table", confidence: 0.92, bbox: { x: 200, y: 180, width: 150, height: 80 }, distance: 2.1 },
    { id: "4", label: "Door", confidence: 0.89, bbox: { x: 50, y: 20, width: 60, height: 180 }, distance: 3.2 },
  ];

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        speak("Camera started. I can now see what's in front of you.");
      }
    } catch (error) {
      speak("Could not access camera. Please check permissions.");
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      speak("Camera stopped.");
    }
  };

  const analyzeScene = () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      setDetections(mockDetections);
      const description = describeScene(mockDetections);
      setLastDescription(description);
      speak(description);
      setIsAnalyzing(false);
    }, 2000);
  };

  const describeScene = (detections: Detection[]) => {
    if (detections.length === 0) {
      return "I don't see any recognizable objects in the current view.";
    }

    const items = detections.map(d => `${d.label} at ${d.distance} meters`);
    const description = `I can see ${items.length} objects: ${items.join(", ")}. The closest object is a ${detections.sort((a, b) => (a.distance || 0) - (b.distance || 0))[0].label} at ${detections[0].distance} meters away.`;
    
    return description;
  };

  const speakDetection = (detection: Detection) => {
    speak(`${detection.label} detected with ${Math.round(detection.confidence * 100)}% confidence at ${detection.distance} meters away.`);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Camera className="h-8 w-8 mr-3 text-primary" />
            Live Vision
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time object detection and scene analysis
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={isStreaming ? stopCamera : startCamera}
            variant={isStreaming ? "destructive" : "default"}
            className="bg-gradient-eco hover:shadow-eco"
          >
            {isStreaming ? <CameraOff className="h-4 w-4 mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
            {isStreaming ? "Stop Camera" : "Start Camera"}
          </Button>
          <Button
            onClick={analyzeScene}
            disabled={!isStreaming || isAnalyzing}
            className="bg-gradient-nature hover:shadow-nature"
          >
            {isAnalyzing ? (
              <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Scan className="h-4 w-4 mr-2" />
            )}
            {isAnalyzing ? "Analyzing..." : "Analyze Scene"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="relative aspect-video bg-surface-1 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 pointer-events-none"
                />
                
                {/* Detection Overlays */}
                {detections.map((detection) => (
                  <div
                    key={detection.id}
                    className="absolute border-2 border-primary bg-primary/10 backdrop-blur-sm rounded cursor-pointer transition-all hover:bg-primary/20"
                    style={{
                      left: `${(detection.bbox.x / 640) * 100}%`,
                      top: `${(detection.bbox.y / 480) * 100}%`,
                      width: `${(detection.bbox.width / 640) * 100}%`,
                      height: `${(detection.bbox.height / 480) * 100}%`,
                    }}
                    onClick={() => speakDetection(detection)}
                  >
                    <div className="absolute -top-8 left-0 bg-primary text-white px-2 py-1 text-xs rounded">
                      {detection.label} ({Math.round(detection.confidence * 100)}%)
                    </div>
                  </div>
                ))}
                
                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-surface-2/50 backdrop-blur-sm">
                    <div className="text-center">
                      <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">Camera Not Active</p>
                      <p className="text-sm text-muted-foreground">Start the camera to begin vision analysis</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detection Panel */}
        <div className="space-y-4">
          {/* Current Detections */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Zap className="h-5 w-5 mr-2 text-secondary" />
                Detected Objects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {detections.length > 0 ? (
                detections
                  .sort((a, b) => (a.distance || 0) - (b.distance || 0))
                  .map((detection) => (
                    <div
                      key={detection.id}
                      className="flex items-center justify-between p-3 bg-surface-1 rounded-lg cursor-pointer hover:bg-surface-2 transition-colors"
                      onClick={() => speakDetection(detection)}
                    >
                      <div>
                        <div className="font-medium">{detection.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {detection.distance}m away
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          {Math.round(detection.confidence * 100)}%
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          <Volume2 className="h-3 w-3 inline" />
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-6">
                  <Scan className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No objects detected yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scene Description */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="h-5 w-5 mr-2 text-accent" />
                Scene Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lastDescription ? (
                <div className="space-y-3">
                  <p className="text-sm">{lastDescription}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speak(lastDescription)}
                    className="w-full"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Repeat Description
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Analyze the scene to get a description
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Voice Commands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• "What do you see?"</div>
              <div>• "Describe this scene"</div>
              <div>• "How far is the [object]?"</div>
              <div>• "Read text"</div>
              <div>• "Find objects"</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}