import { generateMockData } from "@/lib/faker-generator";
import { PRESETS } from "@/lib/presets";
import { Field } from "@/types/mock";
import { useEffect, useState } from "react";

interface UseMockFormProps {
  initialData?: {
    name: string;
    basePath: string;
    description: string;
    isActive?: boolean;
    count: number;
    pagination: boolean;
    randomErrors: boolean;
    errorRate: number;
    delay?: number;
    fields: Field[];
  };
}

export function useMockForm({ initialData }: UseMockFormProps = {}) {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0].name);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    basePath: initialData?.basePath || "",
    description: initialData?.description || "",
    isActive: initialData?.isActive ?? true,
    count: initialData?.count || 10,
    pagination: initialData?.pagination ?? true,
    randomErrors: initialData?.randomErrors || false,
    errorRate: initialData?.errorRate || 0,
    delay: initialData?.delay || 0,
  });

  const [fields, setFields] = useState<Field[]>(initialData?.fields || []);
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Update preview when fields change
  useEffect(() => {
    updatePreview(fields);
  }, [fields]);

  const handlePresetChange = (presetName: string | null) => {
    if (!presetName) return; // Guard against null
    setSelectedPreset(presetName);
    const preset = PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setFields([...preset.fields]);
    }
  };

  const updatePreview = (fieldsToPreview: Field[] = fields) => {
    if (fieldsToPreview.length === 0 || fieldsToPreview.some((f) => !f.name)) {
      setPreviewData([]);
      return;
    }
    const data = generateMockData(fieldsToPreview, 2);
    setPreviewData(data);
  };

  const validateForm = (): { isValid: boolean; error?: string } => {
    if (fields.length === 0) {
      return { isValid: false, error: "Please add at least one field" };
    }
    if (fields.some((f) => !f.name)) {
      return {
        isValid: false,
        error: "Please add at least one field with a name",
      };
    }
    return { isValid: true };
  };

  return {
    formData,
    setFormData,
    fields,
    setFields,
    previewData,
    selectedPreset,
    handlePresetChange,
    updatePreview,
    validateForm,
  };
}
