import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Pour découvrir Mock'n'Go",
      cta: "Get started",
      href: "/dashboard",
      popular: false,
      features: {
        activeMocks: "5",
        mockDuration: "24h",
        requestsPerDay: "100 / mock",
        graphql: false,
        collaboration: false,
        export: false,
        support: "Communauté",
        trial: "-",
      },
    },
    {
      name: "Pro",
      price: "9 €",
      period: "/mo",
      description: "Pour les développeurs professionnels",
      cta: "Get started",
      href: "/dashboard",
      popular: true,
      features: {
        activeMocks: "Illimité",
        mockDuration: "30 jours",
        requestsPerDay: "Illimité",
        graphql: true,
        collaboration: false,
        export: true,
        support: "Email/Discord",
        trial: "14 jours",
      },
    },
    {
      name: "Team",
      price: "29 €",
      period: "/user/mo",
      description: "Pour les équipes qui collaborent",
      cta: "Get started",
      href: "/dashboard",
      popular: false,
      features: {
        activeMocks: "Illimité",
        mockDuration: "Illimitée",
        requestsPerDay: "Illimité",
        graphql: true,
        collaboration: true,
        export: true,
        support: "< 24h",
        trial: "Sur devis",
      },
    },
  ];

  const featureRows = [
    { label: "Mocks actifs simultanés", key: "activeMocks" as const },
    { label: "Durée de vie des mocks", key: "mockDuration" as const },
    { label: "Requêtes par jour", key: "requestsPerDay" as const },
    { label: "Support GraphQL", key: "graphql" as const },
    { label: "Collaboration d'équipe", key: "collaboration" as const },
    { label: "Export MSW / Postman / OpenAPI", key: "export" as const },
    { label: "Support prioritaire", key: "support" as const },
    { label: "Essai gratuit", key: "trial" as const },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-100/10 via-white to-primary/5">
      {/* Header */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl text-primary font-bold tracking-tight mb-4">
          Pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choisissez le plan qui correspond à vos besoins. Commencez gratuitement, évoluez quand vous le souhaitez.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div className="relative" key={plan.name}>
              {plan.popular && (
                <div className="absolute z-10 -top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
            <Card
              className={`relative flex flex-col ${
                plan.popular
                  ? "border-primary/10 border shadow-lg shadow-primary/20 scale-105"
                  : "border-border"
              }`}
              >
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
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
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm">
                      <strong>{plan.features.activeMocks}</strong> mocks actifs
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm">
                      Durée: <strong>{plan.features.mockDuration}</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm">
                      <strong>{plan.features.requestsPerDay}</strong> requêtes
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="container mx-auto px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comparaison détaillée des fonctionnalités
          </h2>
          
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-semibold min-w-[250px]">
                      Feature
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan.name}
                        className={`text-center p-4 font-semibold min-w-[180px] ${
                          plan.popular ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{plan.name}</span>
                          <span className="text-sm font-normal text-muted-foreground">
                            {plan.price}
                            {plan.period}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureRows.map((row, index) => (
                    <tr
                      key={row.key}
                      className={`border-b border-border ${
                        index % 2 === 0 ? "bg-muted/20" : ""
                      }`}
                    >
                      <td className="p-4 font-medium">{row.label}</td>
                      {plans.map((plan) => {
                        const value = plan.features[row.key];
                        const isBoolean = typeof value === "boolean";
                        const isPopular = plan.popular;

                        return (
                          <td
                            key={`${plan.name}-${row.key}`}
                            className={`text-center p-4 ${
                              isPopular ? "bg-primary/5" : ""
                            }`}
                          >
                            {isBoolean ? (
                              value ? (
                                <Check className="h-6 w-6 text-primary mx-auto" />
                              ) : (
                                <X className="h-6 w-6 text-muted-foreground/40 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm font-medium">{value}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Prêt à commencer ?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Créez votre compte gratuitement et commencez à générer des mocks API en quelques secondes.
            </p>
            <Button size="lg" className="text-lg px-8">
              <Link href="/dashboard">Commencer gratuitement</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
