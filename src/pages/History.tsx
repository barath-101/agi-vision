import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVoice } from "@/hooks/useVoice";
import { 
  History as HistoryIcon, 
  Clock, 
  Search, 
  Filter,
  Camera,
  Phone,
  Navigation,
  MessageSquare,
  Trash2,
  Download,
  Volume2
} from "lucide-react";

interface HistoryItem {
  id: string;
  timestamp: Date;
  type: "vision" | "emergency" | "navigation" | "voice_command";
  action: string;
  description: string;
  result?: string;
  duration?: number;
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: "vision",
    action: "Object Detection",
    description: "Scanned environment in office",
    result: "Found 6 objects: desk, chair, computer, mug, window, bookshelf",
    duration: 3
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: "voice_command",
    action: "Voice Navigation",
    description: "Voice command: 'What's around me?'",
    result: "Provided scene description",
    duration: 1
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    type: "navigation",
    action: "Route Guidance",
    description: "Navigation to Conference Room A",
    result: "Successfully guided to destination",
    duration: 180
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: "emergency",
    action: "Emergency Contact",
    description: "Called Dr. Sarah Johnson",
    result: "Call completed successfully",
    duration: 120
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: "vision",
    action: "Text Recognition",
    description: "Read text from document",
    result: "Successfully read 3 paragraphs of text",
    duration: 5
  },
  {
    id: "6",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    type: "voice_command",
    action: "Settings Change",
    description: "Voice command: 'Change voice to male'",
    result: "Voice settings updated",
    duration: 1
  }
];

export default function History() {
  const { speak } = useVoice();
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "vision": return Camera;
      case "emergency": return Phone;
      case "navigation": return Navigation;
      case "voice_command": return MessageSquare;
      default: return Clock;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "vision": return "bg-primary";
      case "emergency": return "bg-emergency";
      case "navigation": return "bg-secondary";
      case "voice_command": return "bg-accent";
      default: return "bg-muted-foreground";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "vision": return "default";
      case "emergency": return "destructive";
      case "navigation": return "secondary";
      case "voice_command": return "outline";
      default: return "secondary";
    }
  };

  const filteredHistory = history
    .filter(item => {
      const matchesSearch = 
        item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.result && item.result.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterType === "all" || item.type === filterType;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }
    });

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const speakHistoryItem = (item: HistoryItem) => {
    const timeAgo = formatTimeAgo(item.timestamp);
    const durationText = item.duration ? `, duration ${formatDuration(item.duration)}` : "";
    speak(`${timeAgo}: ${item.action}. ${item.description}. ${item.result || ""}${durationText}`);
  };

  const clearHistory = () => {
    setHistory([]);
    speak("Interaction history cleared");
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vision-ai-history.json';
    link.click();
    speak("History exported successfully");
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 bg-gradient-eco rounded-2xl flex items-center justify-center">
            <HistoryIcon className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-eco-gradient">History</h1>
            <p className="text-lg text-muted-foreground">Your interaction history and activity log</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vision">Vision</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="navigation">Navigation</SelectItem>
              <SelectItem value="voice_command">Voice Commands</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { type: "vision", label: "Vision", count: history.filter(h => h.type === "vision").length },
          { type: "emergency", label: "Emergency", count: history.filter(h => h.type === "emergency").length },
          { type: "navigation", label: "Navigation", count: history.filter(h => h.type === "navigation").length },
          { type: "voice_command", label: "Voice", count: history.filter(h => h.type === "voice_command").length },
        ].map((stat) => {
          const IconComponent = getTypeIcon(stat.type);
          const colorClass = getTypeColor(stat.type);
          
          return (
            <Card key={stat.type} className="glass-card">
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl font-bold">{stat.count}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* History Items */}
      <div className="space-y-3">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item, index) => {
            const IconComponent = getTypeIcon(item.type);
            const colorClass = getTypeColor(item.type);
            const badgeVariant = getTypeBadgeColor(item.type);
            
            return (
              <Card key={item.id} className="glass-card animate-slide-right" 
                    style={{ animationDelay: `${index * 50}ms` }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center mt-1`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{item.action}</h3>
                          <Badge variant={badgeVariant as any}>{item.type.replace('_', ' ')}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        {item.result && (
                          <p className="text-sm bg-surface-1 p-2 rounded">{item.result}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{formatTimeAgo(item.timestamp)}</div>
                      {item.duration && (
                        <div className="text-xs">{formatDuration(item.duration)}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => speakHistoryItem(item)}
                    >
                      <Volume2 className="h-3 w-3 mr-1" />
                      Hear Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <HistoryIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No History Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterType !== "all" 
                  ? "No interactions match your search criteria." 
                  : "Start using Vision AI to see your interaction history here."
                }
              </p>
              {(searchTerm || filterType !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* History Management */}
      {history.length > 0 && (
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Manage History</h3>
                <p className="text-sm text-muted-foreground">
                  Export or clear your interaction history
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={exportHistory}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="destructive" onClick={clearHistory}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Commands */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">History Voice Commands</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>• "Show my history"</div>
            <div>• "What did I do today?"</div>
            <div>• "Show emergency calls"</div>
          </div>
          <div className="space-y-2">
            <div>• "Clear history"</div>
            <div>• "Export my data"</div>
            <div>• "Show recent activity"</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}