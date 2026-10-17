import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { QASection } from "@/components/QASection";
import { CTASection } from "@/components/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      <main >
        <Hero />
        <QASection />
        <CTASection />
      </main>

      <footer className="py-8 text-center border-t border-border text-muted-foreground">
        © 2026 EstNextStep. All rights reserved.
      </footer>
    </div>
  );
}
