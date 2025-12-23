import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Code2,
  Database,
  Globe,
  Palette,
  Shield,
  Sparkles,
  Zap
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate mock APIs in seconds. No configuration files, no complex setup. Just define your schema and go.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Code2,
      title: "REST API Ready",
      description: "Full REST API support with GET, POST, PUT, PATCH, and DELETE methods. Perfect for any frontend framework.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Database,
      title: "Realistic Data",
      description: "Powered by Faker.js to generate realistic mock data. Names, emails, addresses, and more.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is safe with us. Rate limiting, expiration controls, and organization-based access.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Sparkles,
      title: "Pagination & Filtering",
      description: "Built-in pagination support with customizable page sizes. Filter and sort your mock data easily.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Globe,
      title: "Instant Deployment",
      description: "Your mock API is live instantly with a unique URL. Share it with your team or use it in your apps.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Clock,
      title: "Custom Delays",
      description: "Simulate real-world latency with configurable response delays. Test loading states and timeouts.",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      icon: Palette,
      title: "Flexible Schema",
      description: "Define custom fields with various data types. String, number, boolean, email, URL, and more.",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <section id="features" className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything you need to{" "}
            <span className="text-primary">
              mock APIs
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help you build, test, and prototype faster than ever before.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity -z-10`} />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
