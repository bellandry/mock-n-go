import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Define Your Schema",
      description: "Choose the fields you need for your mock data. Name, email, phone, address, or any custom field.",
      features: ["Multiple data types", "Custom field names", "Faker.js integration"],
    },
    {
      number: "02",
      title: "Configure Options",
      description: "Set pagination, error rates, response delays, and other options to match your needs.",
      features: ["Pagination support", "Random errors", "Custom delays"],
    },
    {
      number: "03",
      title: "Get Your API",
      description: "Receive a unique URL instantly. Your mock API is ready to use in your applications.",
      features: ["Instant deployment", "Unique URL", "Share with team"],
    },
    {
      number: "04",
      title: "Start Building",
      description: "Use your mock API in development, testing, or demos. Update it anytime from your dashboard.",
      features: ["Full REST support", "Real-time updates", "Easy management"],
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="text-primary border-primary/30">
            How it works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold">
            From idea to API in{" "}
            <span className="text-primary">
              4 simple steps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No complex configuration. No backend setup. Just pure simplicity.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-8 items-center`}
            >
              {/* Step Number */}
              <div className="shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-primary to-orange-600 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">{step.number}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 w-1 h-12 bg-linear-to-b from-primary/50 to-transparent" />
                  )}
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-1 space-y-4">
                <h3 className="text-3xl font-bold">{step.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                <ul className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Element */}
              <div className="flex-1 hidden lg:block">
                <div className="aspect-video rounded-lg bg-linear-to-br from-muted to-muted/50 border border-border flex items-center justify-center">
                  <div className="text-6xl">
                    {index === 0 && "📝"}
                    {index === 1 && "⚙️"}
                    {index === 2 && "🚀"}
                    {index === 3 && "💻"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
