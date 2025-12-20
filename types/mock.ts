import { HttpMethod, ResponseType } from "@prisma/client";

// Supported Faker.js field types
export type FieldType =
  // IDs
  | "uuid"
  | "number"
  | "autoIncrement"
  // Person
  | "fullName"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "avatar"
  | "jobTitle"
  // Address
  | "address"
  | "city"
  | "country"
  | "zipCode"
  | "street"
  | "state"
  // Internet
  | "url"
  | "imageUrl"
  | "username"
  | "password"
  | "ip"
  | "userAgent"
  // Text
  | "paragraph"
  | "sentence"
  | "word"
  | "slug"
  | "description"
  // Date & Time
  | "date"
  | "datetime"
  | "pastDate"
  | "futureDate"
  | "timestamp"
  // Boolean & Numbers
  | "boolean"
  | "price"
  | "percentage"
  | "rating"
  // Commerce
  | "productName"
  | "department"
  | "color"
  | "company"
  // Preset-specific types
  | "string"
  | "arrayMern"
  | "github"
  | "currency"
  | "stock"
  | "category"
  | "author"
  | "lorem"
  | "likes"
  | "comments"
  | "createdAt"
  | "title"
  | "excerpt"
  | "loremLong"
  | "publishedAt"
  | "tags"
  | "readTime"
  | "plan"
  | "mrr"
  | "status"
  | "joinedAt"
  | "todoTitle"
  | "completed"
  | "priority"
  | "dueDate"
  | "dishName"
  | "foodCategory"
  | "calories"
  | "vegetarian"
  // Auth | Security
  | "jwt"
  | "token"
  | "role"
  | "permission"
  | "lastLogin"
  | "expiresAt"
  | "tokenType"
  // E-COMMERCE / PAYMENTS
  | "sku"
  | "orderNumber"
  | "orderStatus"
  | "paymentStatus"
  | "paymentProvider"
  | "amount"
  | "tax"
  | "discount"
  | "quantity"
  | "cartTotal"
  // ANALYTICS / METRICS
  | "metricLabel"
  | "count"
  | "trend"
  | "chartValue"
  | "timeSeriesDate"
  // STRUCTURE / DATA
  | "array"
  | "json"
  | "object"
  | "idReference"
  // LOGS / API / ERRORS
  | "httpMethod"
  | "httpStatus"
  | "errorCode"
  | "errorMessage"
  | "action"
  | "entity"
  // MOBILE / DEVICE
  | "deviceType"
  | "os"
  | "osVersion"
  | "appVersion"
  | "browser"
  // COMMUNICATION
  | "shortMessage"
  | "longMessage"
  | "commentBody"
  | "notificationType"
  // GEO / LOCALE
  | "latitude"
  | "longitude"
  | "timezone"
  | "locale"
  | "currencyCode"
  // FEATURE FLAGS / CONFIG
  | "featureKey"
  | "environment"
  | "configKey"
  | "configValue"
  // DATE (SÉMANTIQUE)
  | "createdDate"
  | "updatedDate"
  | "deletedDate"
  // Other
  | "custom";

export interface Field {
  name: string;
  type: FieldType;
  customValue?: string; // For custom type
}

export interface MockConfigInput {
  name: string;
  basePath: string;
  description?: string;
  fields: Field[];
  count?: number;
  pagination?: boolean;
  randomErrors?: boolean;
  errorRate?: number;
  delay?: number;
  expiresAt?: Date;
}

export interface MockEndpointInput {
  method: HttpMethod;
  responseType?: ResponseType;
  statusCode?: number;
  fields?: Field[];
  count?: number;
  pagination?: boolean;
  randomErrors?: boolean;
  errorRate?: number;
  delay?: number;
  requestSchema?: any;
  responseSchema?: any;
  customResponse?: any;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Preset {
  name: string;
  description?: string;
  fields: Field[];
}

export interface MockConfig {
  id: string;
  name: string;
  basePath: string;
  description?: string;
  isActive: boolean;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
  mockUrl: string;
  endpoints: Array<{
    id: string;
    method: string;
    accessCount: number;
    fields: any;
    count: number;
    pagination: boolean;
    randomErrors: boolean;
    errorRate: number;
  }>;
  createdBy: {
    name: string;
    email: string;
  };
}