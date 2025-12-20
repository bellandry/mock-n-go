"use client";

import { MockFormBasicInfo } from "@/components/mocks/mock-form/MockFormBasicInfo";
import { MockFormFields } from "@/components/mocks/mock-form/MockFormFields";
import { MockFormPreview } from "@/components/mocks/mock-form/MockFormPreview";
import { MockFormResponseConfig } from "@/components/mocks/mock-form/MockFormResponseConfig";
import { toastManager } from "@/components/ui/toast";
import { useMockForm } from "@/hooks/useMockForm";
import { Field } from "@/types/mock";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditMockPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  const {
    formData,
    setFormData,
    fields,
    setFields,
    previewData,
    updatePreview,
    validateForm,
  } = useMockForm({ initialData });

  // Fetch existing mock data
  useEffect(() => {
    if (params.id) {
      fetchMock();
    }
  }, [params.id]);

  const fetchMock = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/mock/${params.id}`);
      if (res.ok) {
        const data = await res.json();

        // Get fields from GET endpoint
        const getEndpoint = data.endpoints.find((e: any) => e.method === "GET");
        const loadedFields = (getEndpoint?.fields as Field[]) || [];

        const mockData = {
          name: data.name,
          basePath: data.basePath,
          description: data.description || "",
          isActive: data.isActive,
          count: getEndpoint?.count || 10,
          pagination: getEndpoint?.pagination || false,
          randomErrors: getEndpoint?.randomErrors || false,
          errorRate: getEndpoint?.errorRate || 0,
          delay: getEndpoint?.delay || 0,
          seedData: false,
          seedCount: 5,
          fields: loadedFields,
        };

        setInitialData(mockData);
        setFormData(mockData);
        setFields(loadedFields);
        updatePreview(loadedFields);
      } else if (res.status === 404) {
        router.push("/dashboard/mocks");
      }
    } catch (error) {
      console.error("Error fetching mock:", error);
      toastManager.add({
        type: "error",
        title: "Error",
        description: "Failed to load mock data",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      const res = await fetch(`/api/mock/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fields,
        }),
      });

      if (res.ok) {
        toastManager.add({
          type: "success",
          title: "Success",
          description: "Mock API updated successfully",
        });
        router.push(`/dashboard/mocks/${params.id}`);
      } else {
        const error = await res.json();
        toastManager.add({
          type: "error",
          title: "Error",
          description: error.error || "Failed to update mock",
        });
      }
    } catch (error) {
      console.error("Error updating mock:", error);
      toastManager.add({
        type: "error",
        title: "Error",
        description: "Failed to update mock",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Mock API</h1>
        <p className="text-muted-foreground mt-1">
          Update your mock API configuration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          <MockFormBasicInfo
            formData={formData}
            onFormDataChange={setFormData}
            isEditMode
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
            submitLabel="Update Mock API"
          />
        </div>
      </form>
    </div>
  );
}
