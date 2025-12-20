import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FIELD_TYPES } from "@/lib/faker-generator";
import { Field, FieldType } from "@/types/mock";
import { Plus, Trash2 } from "lucide-react";

interface MockFormFieldsProps {
  fields: Field[];
  onFieldsChange: (fields: Field[]) => void;
}

export function MockFormFields({ fields, onFieldsChange }: MockFormFieldsProps) {
  const addField = () => {
    onFieldsChange([...fields, { name: "", type: "uuid" }]);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    onFieldsChange(newFields);
  };

  const updateField = (index: number, key: keyof Field, value: any) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    onFieldsChange(newFields);
  };

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Fields</h2>
        <Button type="button" size="sm" onClick={addField}>
          <Plus className="w-4 h-4 mr-1" />
          Add Field
        </Button>
      </div>

      <div className="space-y-3">
        {fields.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            No fields yet. Add a field to get started.
          </p>
        ) : (
          fields.map((field, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Field name"
                value={field.name}
                onChange={(e) => updateField(index, "name", e.target.value)}
                className="flex-1"
              />
              <Select
                value={field.type}
                onValueChange={(value) =>
                  updateField(index, "type", value as FieldType)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((ft) => (
                    <SelectItem key={ft.value} value={ft.value}>
                      {ft.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeField(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
