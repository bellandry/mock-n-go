/**
 * Validate data against a JSON Schema
 */
export function validateRequest(
  data: any,
  schema: any
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!schema || typeof schema !== "object") {
    return { valid: true, errors: [] };
  }

  // Validate required fields
  if (schema.required && Array.isArray(schema.required)) {
    for (const field of schema.required) {
      if (!(field in data)) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }

  // Validate properties
  if (schema.properties) {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      const value = data[key];
      const prop = propSchema as any;

      // Skip if field is not present and not required
      if (value === undefined) continue;

      // Type validation
      if (prop.type) {
        const actualType = Array.isArray(value) ? "array" : typeof value;
        if (prop.type !== actualType) {
          errors.push(
            `Field '${key}' must be of type ${prop.type}, got ${actualType}`
          );
        }
      }

      // String validations
      if (prop.type === "string" && typeof value === "string") {
        if (prop.minLength && value.length < prop.minLength) {
          errors.push(
            `Field '${key}' must be at least ${prop.minLength} characters`
          );
        }
        if (prop.maxLength && value.length > prop.maxLength) {
          errors.push(
            `Field '${key}' must be at most ${prop.maxLength} characters`
          );
        }
        if (prop.pattern) {
          const regex = new RegExp(prop.pattern);
          if (!regex.test(value)) {
            errors.push(`Field '${key}' does not match required pattern`);
          }
        }
        if (prop.format === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`Field '${key}' must be a valid email address`);
          }
        }
        if (prop.format === "url") {
          try {
            new URL(value);
          } catch {
            errors.push(`Field '${key}' must be a valid URL`);
          }
        }
      }

      // Number validations
      if (prop.type === "number" && typeof value === "number") {
        if (prop.minimum !== undefined && value < prop.minimum) {
          errors.push(`Field '${key}' must be at least ${prop.minimum}`);
        }
        if (prop.maximum !== undefined && value > prop.maximum) {
          errors.push(`Field '${key}' must be at most ${prop.maximum}`);
        }
      }

      // Array validations
      if (prop.type === "array" && Array.isArray(value)) {
        if (prop.minItems !== undefined && value.length < prop.minItems) {
          errors.push(`Field '${key}' must have at least ${prop.minItems} items`);
        }
        if (prop.maxItems !== undefined && value.length > prop.maxItems) {
          errors.push(`Field '${key}' must have at most ${prop.maxItems} items`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Simple JSON Schema builder helper
 */
export function buildJsonSchema(fields: Array<{
  name: string;
  type: string;
  required?: boolean;
  format?: string;
  min?: number;
  max?: number;
  pattern?: string;
}>): any {
  const schema: any = {
    type: "object",
    properties: {},
    required: [],
  };

  for (const field of fields) {
    const propSchema: any = {
      type: field.type,
    };

    if (field.format) {
      propSchema.format = field.format;
    }

    if (field.type === "string") {
      if (field.min !== undefined) propSchema.minLength = field.min;
      if (field.max !== undefined) propSchema.maxLength = field.max;
      if (field.pattern) propSchema.pattern = field.pattern;
    }

    if (field.type === "number") {
      if (field.min !== undefined) propSchema.minimum = field.min;
      if (field.max !== undefined) propSchema.maximum = field.max;
    }

    schema.properties[field.name] = propSchema;

    if (field.required) {
      schema.required.push(field.name);
    }
  }

  if (schema.required.length === 0) {
    delete schema.required;
  }

  return schema;
}
