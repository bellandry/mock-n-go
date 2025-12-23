import { CTASection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { LandingFooter } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LandingNavbar } from "@/components/landing/navbar";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mock'n'Go - Instant REST API Mock Generator",
  description: "Create realistic REST API mocks instantly. No configuration, no setup. Perfect for frontend development, testing, and prototyping. Generate mock APIs in seconds with pagination, realistic data, and full REST support.",
  openGraph: {
    title: "Mock'n'Go - Instant REST API Mock Generator",
    description: "Create realistic REST API mocks instantly. No configuration, no setup. Perfect for frontend development, testing, and prototyping.",
    url: "https://mngo.laclass.dev",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
