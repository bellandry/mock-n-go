import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Frontend Developer",
      company: "TechCorp",
      avatar: "SC",
      content: "Mock'n'Go saved me hours of backend waiting time. I can now prototype and test my React apps instantly. The pagination support is a game-changer!",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Full Stack Engineer",
      company: "StartupXYZ",
      avatar: "MR",
      content: "The best mock API tool I've used. Super fast setup, realistic data, and the free tier is generous enough for most of my projects.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Product Designer",
      company: "DesignStudio",
      avatar: "EW",
      content: "As a designer who codes, this tool is perfect. I can create realistic prototypes without bothering the backend team. Love the simple UI!",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Tech Lead",
      company: "Enterprise Inc",
      avatar: "DK",
      content: "We use Mock'n'Go for all our frontend demos and testing. The team collaboration features are excellent, and the uptime is rock solid.",
      rating: 5,
    },
    {
      name: "Lisa Anderson",
      role: "Mobile Developer",
      company: "AppFactory",
      avatar: "LA",
      content: "Perfect for mobile app development. The custom delays help me test loading states, and the error simulation is incredibly useful.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "QA Engineer",
      company: "QualityFirst",
      avatar: "JW",
      content: "Mock'n'Go makes testing so much easier. I can create different scenarios quickly and the REST API support covers all our needs.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Loved by{" "}
            <span className="bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              developers worldwide
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who trust Mock'n'Go for their API mocking needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <CardContent className="pt-6">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-primary/20 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-orange-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-8">Trusted by developers at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50">
            <div className="text-2xl font-bold">Google</div>
            <div className="text-2xl font-bold">Microsoft</div>
            <div className="text-2xl font-bold">Amazon</div>
            <div className="text-2xl font-bold">Meta</div>
            <div className="text-2xl font-bold">Netflix</div>
          </div>
        </div>
      </div>
    </section>
  );
}
