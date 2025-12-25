"use client";

import { MockFormBasicInfo } from "@/components/mocks/mock-form/MockFormBasicInfo";
import { MockFormFields } from "@/components/mocks/mock-form/MockFormFields";
import { MockFormPreview } from "@/components/mocks/mock-form/MockFormPreview";
import { MockFormResponseConfig } from "@/components/mocks/mock-form/MockFormResponseConfig";
import { UpgradePrompt } from "@/components/subscription/upgrade-prompt";
import { Badge } from "@/components/ui/badge";
import { toastManager } from "@/components/ui/toast";
import { useMockForm } from "@/hooks/useMockForm";
import { getSubscriptionLimits } from "@/lib/subscription-limits";
import { SubscriptionPlan } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewMockClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [activeMockCount, setActiveMockCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {
    formData,
    setFormData,
    fields,
    setFields,
    previewData,
    selectedPreset,
    handlePresetChange,
    updatePreview,
    validateForm,
  } = useMockForm();

  // Fetch subscription and active mock count
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, mocksRes] = await Promise.all([
          fetch("/api/subscription"),
          fetch("/api/mock"),
        ]);

        if (subRes.ok) {
          const subData = await subRes.json();
          setSubscription(subData);
        }

        if (mocksRes.ok) {
          const mocks = await mocksRes.json();
          const active = mocks.filter(
            (m: any) => m.isActive && (!m.expiresAt || new Date(m.expiresAt) > new Date())
          ).length;
          setActiveMockCount(active);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      toastManager.add({
        type: "error",
        title: "Validation Error",
        description: validation.error || "Please check your form",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fields,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toastManager.add({
          type: "success",
          title: "Success",
          description: "Mock API created successfully",
        });
        router.push(`/dashboard/mocks/${data.id}`);
      } else {
        const error = await res.json();
        toastManager.add({
          type: "error",
          title: "Error",
          description: error.error || "Failed to create mock",
        });
      }
    } catch (error) {
      console.error("Error creating mock:", error);
      toastManager.add({
        type: "error",
        title: "Error",
        description: "Failed to create mock",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const plan = subscription?.plan || SubscriptionPlan.FREE;
  const limits = getSubscriptionLimits(plan);
  const canCreate = limits.maxActiveMocks === -1 || activeMockCount < limits.maxActiveMocks;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Create Mock API</h1>
          <Badge variant="default" className="text-xs">
            {plan}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Configure your mock API endpoint with custom fields
        </p>
        {!isLoading && limits.maxActiveMocks !== -1 && (
          <p className="text-sm text-muted-foreground mt-1">
            Active mocks: <span className="font-medium">{activeMockCount}</span> / {limits.maxActiveMocks}
          </p>
        )}
      </div>

      {!canCreate && (
        <UpgradePrompt
          title="Mock Limit Reached"
          message={`You've reached the maximum of ${limits.maxActiveMocks} active mocks on the ${plan} plan. Upgrade to Pro for unlimited mocks.`}
          variant="banner"
        />
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          <MockFormBasicInfo
            formData={formData}
            onFormDataChange={setFormData}
            onPresetChange={handlePresetChange}
            selectedPreset={selectedPreset}
            plan={plan}
          />

          <MockFormResponseConfig
            formData={formData}
            onFormDataChange={setFormData}
          />

          <MockFormFields fields={fields} onFieldsChange={setFields} />
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <MockFormPreview
            previewData={previewData}
            onRefresh={() => updatePreview()}
            onSubmit={() => handleSubmit}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting || !canCreate}
            fieldsCount={fields.length}
            submitLabel="Create Mock API"
          />
        </div>
      </form>
    </div>
  );
}
