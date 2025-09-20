import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useVoice } from "@/hooks/useVoice";
import { toast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Volume2, 
  Mic, 
  Eye,
  Accessibility,
  Bell,
  Shield,
  Palette,
  User
} from "lucide-react";

export default function Settings() {
  const { speak } = useVoice();
  const [settings, setSettings] = useState({
    voiceGender: "female",
    voiceSpeed: [0.9],
    volume: [80],
    autoSpeak: true,
    hapticFeedback: true,
    highContrast: false,
    largeText: false,
    voiceConfirmation: true,
    emergencyAlerts: true,
    locationSharing: true,
    backgroundProcessing: true,
    language: "en-US",
    theme: "auto"
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Provide voice feedback for important changes
    if (key === 'voiceGender') {
      speak(`Voice changed to ${value}`);
    } else if (key === 'voiceSpeed') {
      speak(`Voice speed adjusted`);
    } else if (key === 'volume') {
      speak(`Volume set to ${value[0]} percent`);
    }
    
    toast({
      title: "Setting Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been updated.`,
    });
  };

  const testVoice = () => {
    speak("This is a test of your current voice settings. The voice speed and volume have been applied.");
  };

  const resetSettings = () => {
    setSettings({
      voiceGender: "female",
      voiceSpeed: [0.9],
      volume: [80],
      autoSpeak: true,
      hapticFeedback: true,
      highContrast: false,
      largeText: false,
      voiceConfirmation: true,
      emergencyAlerts: true,
      locationSharing: true,
      backgroundProcessing: true,
      language: "en-US",
      theme: "auto"
    });
    speak("Settings have been reset to defaults");
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to their default values.",
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 bg-gradient-eco rounded-2xl flex items-center justify-center">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-eco-gradient">Settings</h1>
            <p className="text-lg text-muted-foreground">Customize your Vision AI experience</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Settings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="h-6 w-6 mr-2 text-primary" />
              Voice Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="voice-gender">Voice Gender</Label>
              <Select value={settings.voiceGender} onValueChange={(value) => updateSetting('voiceGender', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Voice Speed: {settings.voiceSpeed[0]}</Label>
              <Slider
                value={settings.voiceSpeed}
                onValueChange={(value) => updateSetting('voiceSpeed', value)}
                max={2}
                min={0.5}
                step={0.1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>

            <div>
              <Label>Volume: {settings.volume[0]}%</Label>
              <Slider
                value={settings.volume}
                onValueChange={(value) => updateSetting('volume', value)}
                max={100}
                min={0}
                step={5}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Mute</span>
                <span>Loud</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-speak">Auto-speak responses</Label>
              <Switch
                id="auto-speak"
                checked={settings.autoSpeak}
                onCheckedChange={(checked) => updateSetting('autoSpeak', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="voice-confirmation">Voice confirmations</Label>
              <Switch
                id="voice-confirmation"
                checked={settings.voiceConfirmation}
                onCheckedChange={(checked) => updateSetting('voiceConfirmation', checked)}
              />
            </div>

            <Button onClick={testVoice} variant="outline" className="w-full">
              <Mic className="h-4 w-4 mr-2" />
              Test Voice Settings
            </Button>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Accessibility className="h-6 w-6 mr-2 text-secondary" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast">High contrast mode</Label>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="large-text">Large text size</Label>
              <Switch
                id="large-text"
                checked={settings.largeText}
                onCheckedChange={(checked) => updateSetting('largeText', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="haptic-feedback">Haptic feedback</Label>
              <Switch
                id="haptic-feedback"
                checked={settings.hapticFeedback}
                onCheckedChange={(checked) => updateSetting('hapticFeedback', checked)}
              />
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                  <SelectItem value="de-DE">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-6 w-6 mr-2 text-accent" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="location-sharing">Location sharing</Label>
              <Switch
                id="location-sharing"
                checked={settings.locationSharing}
                onCheckedChange={(checked) => updateSetting('locationSharing', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="background-processing">Background processing</Label>
              <Switch
                id="background-processing"
                checked={settings.backgroundProcessing}
                onCheckedChange={(checked) => updateSetting('backgroundProcessing', checked)}
              />
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <User className="h-4 w-4 mr-2" />
                Manage Data
              </Button>
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Privacy Policy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-6 w-6 mr-2 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="emergency-alerts">Emergency alerts</Label>
              <Switch
                id="emergency-alerts"
                checked={settings.emergencyAlerts}
                onCheckedChange={(checked) => updateSetting('emergencyAlerts', checked)}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Configure when and how you receive notifications for vision analysis, 
                emergency situations, and system updates.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reset Settings */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Reset Settings</h3>
              <p className="text-sm text-muted-foreground">
                Restore all settings to their default values
              </p>
            </div>
            <Button variant="destructive" onClick={resetSettings}>
              Reset All Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Commands */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Settings Voice Commands</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>• "Change voice to male/female"</div>
            <div>• "Increase/decrease volume"</div>
            <div>• "Test voice settings"</div>
          </div>
          <div className="space-y-2">
            <div>• "Enable/disable auto-speak"</div>
            <div>• "Turn on high contrast"</div>
            <div>• "Reset settings"</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}