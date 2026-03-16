import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/university_students_and_alumni_networking_in_a_bright_modern_campus_setting.png";

export function Hero() {
  const [, navigate] = useLocation();

  return (
    <section className="relative py-12 lg:py-32 bg-linear-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* TEXT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Connect with <span className="text-primary">Alumni</span>.<br />
              Ask Smart. <span className="text-accent">Grow Faster.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              A trusted community where alumni share real experiences and students
              ask questions to shape their academic and career journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
              <Button size="lg" className="h-12 px-8"
              onClick={() => navigate("/experiences")}>
                Explore experiences
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8"
                onClick={() => navigate("/orientation")}
              >
                Take Orientation
              </Button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
              {[
                { number: "5k+", label: "Active Alumni" },
                { number: "120+", label: "Experiences Shared" },
                { number: "95%", label: "Satisfaction Rate" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-2xl font-bold text-primary">
                    {item.number}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* IMAGE SIDE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-3xl overflow-hidden border border-border shadow-xl">
              <img
                src={heroImage}
                alt="Alumni networking"
                className="w-full object-cover aspect-4/3"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
