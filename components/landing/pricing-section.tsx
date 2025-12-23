import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying out Mock'n'Go",
      features: [
        "5 active mocks",
        "24h mock duration",
        "100 requests/day per mock",
        "Basic support",
      ],
      cta: "Start for free",
      popular: false,
    },
    {
      name: "Pro",
      price: "9€",
      period: "/mo",
      description: "For professional developers",
      features: [
        "Unlimited active mocks",
        "30 days mock duration",
        "Unlimited requests",
        "GraphQL support",
        "Export to MSW/Postman",
        "Priority support",
      ],
      cta: "Start 14-day trial",
      popular: true,
    },
    {
      name: "Team",
      price: "29€",
      period: "/user/mo",
      description: "For collaborative teams",
      features: [
        "Everything in Pro",
        "Unlimited mock duration",
        "Team collaboration",
        "Advanced analytics",
        "24h support",
        "Custom integrations",
      ],
      cta: "Contact sales",
      popular: false,
    },
  ];

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Simple,{" "}
            <span className="text-primary">
              transparent pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div key={index} className="relative">
              {plan.popular && (
                <div className="absolute -top-7 z-10 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <Card
                className={`relative flex flex-col ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/20 scale-105"
                    : "border-border"
                }`}
              >
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href={plan.name === "Team" ? "#contact" : "/dashboard"}>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                        {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>

        {/* View Full Pricing Link */}
        <div className="text-center">
          <Link href="/pricing">
            <Button variant="ghost" size="lg" className="gap-2 group">
              View detailed pricing comparison
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
