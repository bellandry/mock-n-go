import { Button } from "@/components/ui/button";
import { ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-orange-50/50 via-transparent to-primary/5 dark:from-orange-950/20 dark:to-primary/10 -z-10" />
      
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
            <span className="text-sm font-medium text-primary">
              Generate mock APIs in seconds
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-linear-to-r from-primary to-red-600 bg-clip-text text-transparent">
              Mock APIs
            </span>
            <br />
            <span className="text-foreground">Made Simple</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Create realistic REST API mocks instantly. No configuration, no setup.
            Perfect for frontend development, testing, and prototyping.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 h-14 gap-2 group">
                Start for free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 gap-2">
                <Code2 className="w-5 h-5" />
                See how it works
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground">API Requests</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>

          {/* Demo Preview */}
          <div className="pt-12">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-orange-500/20 blur-3xl" />
              <div className="relative rounded-lg border border-border bg-card/90 backdrop-blur-sm p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <pre className="text-left text-sm overflow-x-auto">
                  <code className="text-muted-foreground">
{`GET /api/mock/abc123/users?page=1&limit=10

{
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
