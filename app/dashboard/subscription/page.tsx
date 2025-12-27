import { CheckoutButton } from "@/components/subscription/checkout-button";
import { SubscriptionStatus } from "@/components/subscription/subscription-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { getEffectivePlan, getOrganizationSubscription, getTrialDaysRemaining } from "@/lib/subscription-helpers";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SubscriptionPage() {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session?.session) {
    redirect("/sign-in?callbackUrl=%2Fdashboard%2Fsubscription");
  }

  let activeOrganizationId = session.session.activeOrganizationId;
  
  // If no active organization, try to set one automatically
  if (!activeOrganizationId) {
    // Find user's first organization
    const userMembership = await db.member.findFirst({
      where: { userId: session.user.id },
      include: { organization: true },
    });

    if (userMembership) {
      // Set this organization as active
      await auth.api.setActiveOrganization({
        headers: await headers(),
        body: {
          organizationId: userMembership.organizationId,
        },
      });
      activeOrganizationId = userMembership.organizationId;
    } else {
      // User has no organizations, redirect to dashboard
      redirect("/dashboard");
    }
  }

  // Get subscription details
  const subscription = await getOrganizationSubscription(activeOrganizationId);
  const effectivePlan = getEffectivePlan(subscription);
  const trialDaysRemaining = getTrialDaysRemaining(subscription);

  return (
    <div className="container max-w-7xl w-full mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Subscription & Billing</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription plan and billing information
        </p>
      </div>

      <div className="grid gap-6">
        {/* Current Subscription Status */}
        <SubscriptionStatus
          plan={effectivePlan}
          status={subscription.status}
          isTrialing={subscription.isTrialing}
          trialDaysRemaining={trialDaysRemaining}
          currentPeriodEnd={subscription.currentPeriodEnd}
        />

        {/* Upgrade Options */}
        {effectivePlan === "FREE" && (
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>
                Unlock more features and remove limitations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Pro Plan */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">Pro</h3>
                    <p className="text-2xl font-bold">$9<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Unlimited active mocks</li>
                    <li>✓ Unlimited requests</li>
                    <li>✓ GraphQL support</li>
                    <li>✓ Export to MSW/Postman</li>
                  </ul>
                  <CheckoutButton plan="PRO" className="w-full">
                    Upgrade to Pro
                  </CheckoutButton>
                </div>

                {/* Team Plan */}
                <div className="border rounded-lg p-4 space-y-3 border-primary/50 bg-primary/5">
                  <div>
                    <h3 className="font-semibold text-lg">Team</h3>
                    <p className="text-2xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/user/month</span></p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Everything in Pro</li>
                    <li>✓ Team collaboration</li>
                    <li>✓ Unlimited mock lifetime</li>
                    <li>✓ Priority support (&lt; 24h)</li>
                  </ul>
                  <CheckoutButton plan="TEAM" className="w-full">
                    Upgrade to Team
                  </CheckoutButton>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Plan Details */}
        {effectivePlan !== "FREE" && (
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
              <CardDescription>
                Your current subscription information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current Plan</span>
                  <span className="text-sm font-semibold">{effectivePlan}</span>
                </div>
                
                {subscription.currentPeriodStart && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Billing Period</span>
                    <span className="text-sm">
                      {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {" "}
                      {subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                )}

                {subscription.status === "ACTIVE" && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-4">
                      Need to make changes to your subscription? Contact our support team.
                    </p>
                    <Link href="mailto:support@mngo.laclass.dev">
                      <Button variant="outline" size="sm">
                        Contact Support
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing History (placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              View your past invoices and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No billing history available yet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
