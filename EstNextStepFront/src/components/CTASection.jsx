import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function CTASection() {
  const [, navigate] = useLocation();

  return (
    <section className="py-24 bg-gradient-to-r from-primary/10 to-accent/10">
      <div className="container mx-auto px-4 text-center max-w-3xl">

        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Not Sure What Path Fits You?
        </h2>

        <p className="text-lg text-muted-foreground mb-8">
          Take our smart orientation quiz and get personalized recommendations
          based on your interests and goals.
        </p>

        <Button
          size="lg"
          className="h-14 px-10"
          onClick={() => navigate("/orientation")}
        >
          Start Orientation Quiz
        </Button>

      </div>
    </section>
  );
}
