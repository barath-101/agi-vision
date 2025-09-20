import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useVoice } from "@/hooks/useVoice";
import { 
  Shield, 
  Activity, 
  Database, 
  Cpu, 
  Wifi, 
  Camera,
  Mic,
  Volume2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download
} from "lucide-react";

interface SystemStatus {
  camera: "active" | "inactive" | "error";
  microphone: "active" | "inactive" | "error";
  speech: "active" | "inactive" | "error";
  location: "active" | "inactive" | "error";
  network: "connected" | "disconnected" | "slow";
}

interface ModelStatus {
  name: string;
  status: "loaded" | "loading" | "error" | "not_loaded";
  version: string;
  accuracy: number;
  lastUpdate: Date;
}

export default function Admin() {
  const { speak } = useVoice();
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    camera: "active",
    microphone: "active", 
    speech: "active",
    location: "active",
    network: "connected"
  });

  const [models] = useState<ModelStatus[]>([
    {
      name: "YOLOv8 Object Detection",
      status: "loaded",
      version: "8.0.0",
      accuracy: 92.5,
      lastUpdate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      name: "MiDaS Depth Estimation", 
      status: "loaded",
      version: "3.1.0",
      accuracy: 88.3,
      lastUpdate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      name: "DeepSORT Tracking",
      status: "loading",
      version: "1.0.0",
      accuracy: 85.7,
      lastUpdate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      name: "Text Recognition (OCR)",
      status: "error",
      version: "2.1.0", 
      accuracy: 94.1,
      lastUpdate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [systemMetrics] = useState({
    memoryUsage: 68,
    cpuUsage: 45,
    storageUsed: 2.3,
    storageTotal: 8.0,
    batteryLevel: 78,
    networkSpeed: 45.2
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "loaded":
      case "connected":
        return CheckCircle;
      case "loading":
      case "slow":
        return RefreshCw;
      case "error":
      case "inactive":
      case "disconnected":
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "loaded": 
      case "connected":
        return "text-secondary";
      case "loading":
      case "slow":
        return "text-yellow-500";
      case "error":
      case "inactive":
      case "disconnected":
        return "text-emergency";
      default:
        return "text-muted-foreground";
    }
  };

  const runDiagnostics = async () => {
    speak("Running system diagnostics...");
    
    // Simulate diagnostic checks
    const checks = ["camera", "microphone", "speech", "location", "network"];
    for (let i = 0; i < checks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate mostly successful checks
      const status = Math.random() > 0.8 ? "error" : "active";
      setSystemStatus(prev => ({ ...prev, [checks[i]]: status }));
    }
    
    speak("System diagnostics completed. Check the results below.");
  };

  const testVoiceSystem = () => {
    speak("Testing voice system. Microphone input is working. Speech synthesis is working. Voice recognition is active.");
  };

  const exportLogs = () => {
    const logs = {
      timestamp: new Date().toISOString(),
      systemStatus,
      models,
      metrics: systemMetrics
    };
    
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vision-ai-system-logs.json';
    link.click();
    
    speak("System logs exported successfully");
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 bg-gradient-eco rounded-2xl flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-eco-gradient">Admin & Debug</h1>
            <p className="text-lg text-muted-foreground">System monitoring and diagnostics</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={runDiagnostics} className="h-16 bg-gradient-eco hover:shadow-eco">
          <Activity className="h-5 w-5 mr-2" />
          Run Diagnostics
        </Button>
        <Button onClick={testVoiceSystem} variant="outline" className="h-16">
          <Volume2 className="h-5 w-5 mr-2" />
          Test Voice System
        </Button>
        <Button onClick={exportLogs} variant="outline" className="h-16">
          <Download className="h-5 w-5 mr-2" />
          Export Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-6 w-6 mr-2 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(systemStatus).map(([component, status]) => {
              const StatusIcon = getStatusIcon(status);
              const statusColor = getStatusColor(status);
              
              const componentLabels = {
                camera: "Camera",
                microphone: "Microphone", 
                speech: "Speech Synthesis",
                location: "Location Services",
                network: "Network Connection"
              };
              
              const componentIcons = {
                camera: Camera,
                microphone: Mic,
                speech: Volume2,
                location: Activity,
                network: Wifi
              };
              
              const ComponentIcon = componentIcons[component as keyof typeof componentIcons];
              
              return (
                <div key={component} className="flex items-center justify-between p-3 bg-surface-1 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ComponentIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                      {componentLabels[component as keyof typeof componentLabels]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                    <Badge variant={status === "active" || status === "connected" ? "secondary" : "destructive"}>
                      {status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* System Metrics */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cpu className="h-6 w-6 mr-2 text-secondary" />
              System Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Memory Usage</span>
                <span>{systemMetrics.memoryUsage}%</span>
              </div>
              <Progress value={systemMetrics.memoryUsage} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>CPU Usage</span>
                <span>{systemMetrics.cpuUsage}%</span>
              </div>
              <Progress value={systemMetrics.cpuUsage} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Storage</span>
                <span>{systemMetrics.storageUsed}GB / {systemMetrics.storageTotal}GB</span>
              </div>
              <Progress value={(systemMetrics.storageUsed / systemMetrics.storageTotal) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Battery Level</span>
                <span>{systemMetrics.batteryLevel}%</span>
              </div>
              <Progress value={systemMetrics.batteryLevel} className="h-2" />
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Network Speed</span>
              <span>{systemMetrics.networkSpeed} Mbps</span>
            </div>
          </CardContent>
        </Card>

        {/* AI Models Status */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-6 w-6 mr-2 text-accent" />
              AI Models Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {models.map((model, index) => {
              const StatusIcon = getStatusIcon(model.status);
              const statusColor = getStatusColor(model.status);
              
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-surface-1 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{model.name}</h3>
                      <Badge variant={model.status === "loaded" ? "secondary" : 
                                   model.status === "loading" ? "outline" : "destructive"}>
                        {model.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>v{model.version}</span>
                      <span>Accuracy: {model.accuracy}%</span>
                      <span>Updated: {model.lastUpdate.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <StatusIcon className={`h-5 w-5 ${statusColor} ${model.status === "loading" ? "animate-spin" : ""}`} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Debug Information */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Environment</h4>
            <div className="space-y-1 text-muted-foreground">
              <div>Browser: Chrome 120.0</div>
              <div>OS: Windows 11</div>
              <div>Screen: 1920x1080</div>
              <div>Touch: Supported</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">API Endpoints</h4>
            <div className="space-y-1 text-muted-foreground">
              <div>Vision API: Ready</div>
              <div>Emergency: Ready</div>
              <div>Location: Ready</div>
              <div>Storage: Local</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Performance</h4>
            <div className="space-y-1 text-muted-foreground">
              <div>App Load: 1.2s</div>
              <div>Voice Latency: 150ms</div>
              <div>Vision Processing: 2.1s</div>
              <div>FPS: 30</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Commands */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Admin Voice Commands</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>• "Run diagnostics"</div>
            <div>• "Test voice system"</div>
            <div>• "Check system status"</div>
          </div>
          <div className="space-y-2">
            <div>• "Export logs"</div>
            <div>• "Show debug info"</div>
            <div>• "System report"</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}