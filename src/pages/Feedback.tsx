import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVoice } from "@/hooks/useVoice";
import { toast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Send, 
  Star, 
  Bug, 
  Lightbulb,
  Heart,
  ThumbsUp
} from "lucide-react";

interface FeedbackData {
  type: string;
  rating: number;
  message: string;
  email: string;
}

export default function Feedback() {
  const { speak } = useVoice();
  const [feedback, setFeedback] = useState<FeedbackData>({
    type: "",
    rating: 0,
    message: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { value: "bug", label: "Bug Report", icon: Bug, description: "Report a problem or error" },
    { value: "feature", label: "Feature Request", icon: Lightbulb, description: "Suggest a new feature" },
    { value: "improvement", label: "Improvement", icon: ThumbsUp, description: "Suggest an enhancement" },
    { value: "general", label: "General Feedback", icon: MessageSquare, description: "Share your thoughts" },
    { value: "appreciation", label: "Appreciation", icon: Heart, description: "Share what you love" }
  ];

  const handleRatingClick = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
    speak(`Rated ${rating} out of 5 stars`);
  };

  const handleSubmit = async () => {
    if (!feedback.type || !feedback.message) {
      speak("Please select a feedback type and enter your message.");
      toast({
        title: "Missing Information",
        description: "Please select a feedback type and enter your message.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      speak("Thank you for your feedback! We appreciate your input and will review it carefully.");
      toast({
        title: "Feedback Submitted",
        description: "Thank you for helping us improve Vision AI!",
      });
      
      // Reset form
      setFeedback({
        type: "",
        rating: 0,
        message: "",
        email: ""
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const selectedType = feedbackTypes.find(type => type.value === feedback.type);

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 bg-gradient-eco rounded-2xl flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-eco-gradient">Feedback</h1>
            <p className="text-lg text-muted-foreground">Help us improve Vision AI</p>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your feedback is valuable to us. Whether it's a bug report, feature request, 
          or general suggestion, we'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              {selectedType ? (
                <selectedType.icon className="h-6 w-6 mr-2 text-primary" />
              ) : (
                <MessageSquare className="h-6 w-6 mr-2 text-primary" />
              )}
              Share Your Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Feedback Type */}
            <div>
              <Label htmlFor="feedback-type">What type of feedback do you have? *</Label>
              <Select value={feedback.type} onValueChange={(value) => setFeedback(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  {feedbackTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedType && (
                <p className="text-sm text-muted-foreground mt-1">{selectedType.description}</p>
              )}
            </div>

            {/* Rating */}
            <div>
              <Label>How would you rate your overall experience?</Label>
              <div className="flex items-center space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    className={`p-1 transition-colors ${
                      star <= feedback.rating ? "text-yellow-400" : "text-muted-foreground"
                    }`}
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star className={`h-6 w-6 ${star <= feedback.rating ? "fill-current" : ""}`} />
                  </button>
                ))}
                {feedback.rating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {feedback.rating} out of 5 stars
                  </span>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message">Your feedback *</Label>
              <Textarea
                id="message"
                placeholder="Please share your thoughts, suggestions, or describe any issues you've encountered..."
                value={feedback.message}
                onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
                className="min-h-32 mt-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {feedback.message.length}/500 characters
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <input
                type="email"
                id="email"
                placeholder="your.email@example.com"
                value={feedback.email}
                onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
                className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Provide your email if you'd like us to follow up with you
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !feedback.type || !feedback.message}
              className="w-full bg-gradient-eco hover:shadow-eco"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Feedback Types Info */}
        <div className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Feedback Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedbackTypes.map((type, index) => (
                <div
                  key={type.value}
                  className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors animate-scale-in ${
                    feedback.type === type.value ? "bg-primary/10 border border-primary/20" : "hover:bg-surface-1"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setFeedback(prev => ({ ...prev, type: type.value }))}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    feedback.type === type.value ? "bg-primary" : "bg-surface-2"
                  }`}>
                    <type.icon className={`h-5 w-5 ${
                      feedback.type === type.value ? "text-white" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${feedback.type === type.value ? "text-primary" : ""}`}>
                      {type.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Other Ways to Reach Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">Email Support</h4>
                <p className="text-muted-foreground">support@visionai.com</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Community Forum</h4>
                <p className="text-muted-foreground">Join discussions with other users</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Documentation</h4>
                <p className="text-muted-foreground">Find answers in our help center</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Our Commitment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Average response time:</span>
                <span className="font-medium">24 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Feedback implemented:</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="flex justify-between">
                <span>User satisfaction:</span>
                <span className="font-medium">4.8/5</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Voice Commands */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Feedback Voice Commands</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>• "Open feedback"</div>
            <div>• "Report a bug"</div>
            <div>• "Submit feedback"</div>
          </div>
          <div className="space-y-2">
            <div>• "Rate 5 stars"</div>
            <div>• "Feature request"</div>
            <div>• "Send message"</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}