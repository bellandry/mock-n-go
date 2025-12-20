"use client";

import { MockFormBasicInfo } from "@/components/mocks/mock-form/MockFormBasicInfo";
import { MockFormFields } from "@/components/mocks/mock-form/MockFormFields";
import { MockFormPreview } from "@/components/mocks/mock-form/MockFormPreview";
import { MockFormResponseConfig } from "@/components/mocks/mock-form/MockFormResponseConfig";
import { toastManager } from "@/components/ui/toast";
import { useMockForm } from "@/hooks/useMockForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewMockPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Mock API</h1>
        <p className="text-muted-foreground mt-1">
          Configure your mock API endpoint with custom fields
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          <MockFormBasicInfo
            formData={formData}
            onFormDataChange={setFormData}
            onPresetChange={handlePresetChange}
            selectedPreset={selectedPreset}
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
            isSubmitting={isSubmitting}
            fieldsCount={fields.length}
            submitLabel="Create Mock API"
          />
        </div>
      </form>
    </div>
  );
}
