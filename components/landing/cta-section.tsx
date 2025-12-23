import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      {/* <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-orange-500/5 to-transparent -z-10" /> */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl -z-10" /> */}

      <div className="container mx-auto max-w-4xl">
        <div className="relative">
          {/* Decorative Border */}
          <div className="absolute inset-0 bg-linear-to-r from-primary via-orange-500 to-red-500 rounded-2xl blur-xl opacity-20" />
          
          {/* Content Card */}
          <div className="relative bg-card border border-border rounded-2xl p-12 text-center space-y-8">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-primary to-primary">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to{" "}
                <span className="text-primary">
                  supercharge
                </span>
                <br />
                your development?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of developers who are building faster with Mock'n'Go.
                Start for free, no credit card required.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 h-14 gap-2 group">
                  Get started for free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                  View pricing
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                ✨ No credit card required • 🚀 Start in seconds • 💯 Free forever plan
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
