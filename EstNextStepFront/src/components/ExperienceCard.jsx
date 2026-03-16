import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";  
import { useToast } from "@/hooks/use-toast"; 

export function ExperienceCard({ name, role, username, image, quote, tags, alumniId }) {
  const [, setLocation] = useLocation();
  const { user } = useAuth(); 
  const { toast } = useToast();

  const handleClick = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You must login to view user profiles",
        variant: "destructive",
      });
      return; 
    }
   
    if ( alumniId === user.id) {
      setLocation("/profile");
    } else {
      setLocation(`/profile/${username}`);
    }
  };

  return (
    <Card className="h-full border-border shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] transition-all duration-300 group">
      <CardHeader className="p-6 pb-0">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-500 blur opacity-0 group-hover:opacity-20 transition-opacity" />
            <img 
              src={image} 
              alt={name} 
              className="h-16 w-16 rounded-full object-cover border-2 border-background shadow-md relative z-10 cursor-pointer"
              onClick={handleClick} 
            />
          </div>
          <div>
            <h3
              className="font-bold text-lg text-foreground group-hover:text-primary transition-colors cursor-pointer"
              onClick={handleClick}
            >
              {name}
            </h3>
            <p className="text-sm font-medium text-muted-foreground">{username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4 flex flex-col">
        <div className="flex items-start gap-3 mb-4">
          <Quote className="h-5 w-5 text-primary/30 shrink-0 mt-1" />
          <p className="text-muted-foreground leading-relaxed wrap-break-word max-h-32 overflow-auto">
            "{quote}"
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}