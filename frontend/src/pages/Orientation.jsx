import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import background from "@assets/generated_images/abstract_geometric_background_representing_career_paths_and_connections.png";
import { api } from "../api/api";
const steps = [
  {
    id: 1,
    question: "Do you enjoy working with numbers, mathematics, and logical reasoning?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 2,
    question: "Are you interested in understanding how machines or mechanical systems work?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 3,
    question: "Do you enjoy programming, coding, or working with computers?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 4,
    question: "Are you interested in electricity, electronics, or energy systems?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 5,
    question: "Do you enjoy solving complex problems and finding technical solutions?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 6,
    question: "Are you interested in data analysis, artificial intelligence, or machine learning?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 7,
    question: "Do you like working with physical concepts such as physics or applied sciences?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 8,
    question: "Are you interested in designing, building, or improving technical systems?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 9,
    question: "Do you enjoy studying economics, finance, or business topics?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 10,
    question: "Are you interested in management, leadership, or organizing projects and teams?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 11,
    question: "Do you enjoy scientific research and exploring how the world works?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 12,
    question: "Are you interested in environmental issues, sustainability, or renewable energy?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 13,
    question: "Do you prefer practical, hands-on work rather than theoretical study?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 14,
    question: "Do you enjoy working in teams and collaborating with others?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 15,
    question: "Are you interested in entrepreneurship or starting your own business?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 16,
    question: "Do you like learning new technologies and adapting to rapid changes?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 17,
    question: "Are you more interested in abstract thinking than physical or technical systems?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 18,
    question: "Do you enjoy long-term projects that require analysis and planning?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 19,
    question: "Are you interested in sciences such as physics, chemistry, or biology?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  },
  {
    id: 20,
    question: "Do you see yourself working in a technical engineering-related field?",
    options: ["Not at all", "Low", "Medium", "High", "Very high"]
  }
];



export default function Orientation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleOptionSelect = (value) => {
    setAnswers(prev => ({ ...prev, [steps[currentStep].id]: value }));
  };

 const handleNext = async () => {
  if (currentStep < steps.length - 1) {
    setCurrentStep(prev => prev + 1);
  } else {
    setIsCompleted(true);

    const payload = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: Number(questionId),
      answer: answer,
    }));

    try {
      const response = await api.post("/orientation/test", payload);
      console.log("Recommendations received:", response.data);

      setRecommendations(response.data);
    } catch (err) {
      console.error("Failed to send answers:", err.response?.data || err.message);
    }
  }
};

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex  items-center justify-center p-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <img src={background} alt="Background" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-linear-to-b from-background/80 to-background/90 backdrop-blur-[2px]" />
        </div>

        <div className="w-full max-w-2xl relative z-10">
          {/* Progress Indicator */}
          {!isCompleted && (
            <div className="mb-8 space-y-2">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Question {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border shadow-xl">
                  <CardContent className="p-8 md:p-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 leading-tight">
                      {steps[currentStep].question}
                    </h2>
                    
                    <RadioGroup 
                      onValueChange={handleOptionSelect} 
                      value={answers[steps[currentStep].id]}
                      className="space-y-4"
                    >
                      {steps[currentStep].options.map((option) => (
                        <div key={option} className="relative">
                          <RadioGroupItem value={option} id={option} className="peer sr-only" />
                          <Label
                            htmlFor={option}
                            className="flex items-center justify-between p-4 rounded-xl border-2 border-border bg-card hover:bg-secondary/50 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-secondary/50 cursor-pointer transition-all duration-200 group"
                          >
                            <span className="text-base font-medium text-foreground peer-data-[state=checked]:text-primary">
                              {option}
                            </span>
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary transition-colors flex items-center justify-center">
                              <CheckCircle2 className="h-3 w-3 text-white opacity-0 peer-data-[state=checked]:opacity-100" />
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="flex justify-between mt-10 pt-6 border-t border-border">
                      <Button 
                        variant="ghost" 
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button 
                        onClick={handleNext}
                        disabled={!answers[steps[currentStep].id]}
                        className="px-8"
                      >
                        {currentStep === steps.length - 1 ? "Finish" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Card className="border-border shadow-xl">
                  <CardContent className="p-12">
                    <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">All Set!</h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                      Thanks for completing the orientation. We've curated a list of mentors and clubs just for you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg">
                        View Recommendations
                      </Button>
                      <Button size="lg" variant="outline">
                        Return Home
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
