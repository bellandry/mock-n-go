import { Preset } from "../types/mock";

export const PRESETS: Preset[] = [
  {
    name: "Custom",
    description: "Create your custom configutation field.",
    fields: [],
  },
  {
    name: "MERN Stack Developer",
    description: "Profiles of MERN Stack developers",
    fields: [
      { name: "id", type: "uuid" },
      { name: "fullName", type: "fullName" },
      { name: "username", type: "username" },
      { name: "email", type: "email" },
      { name: "jobTitle", type: "jobTitle" },
      { name: "techStack", type: "arrayMern" },
      { name: "yearsExperience", type: "number" },
      { name: "github", type: "github" },
      { name: "country", type: "country" },
      { name: "available", type: "boolean" },
      { name: "createdAt", type: "createdAt" },
    ],
  },
  {
    name: "E-commerce Product",
    description: "Products for online store",
    fields: [
      { name: "id", type: "uuid" },
      { name: "sku", type: "sku" },
      { name: "title", type: "productName" },
      { name: "slug", type: "slug" },
      { name: "description", type: "description" },
      { name: "price", type: "price" },
      { name: "currency", type: "currency" },
      { name: "stock", type: "stock" },
      { name: "category", type: "category" },
      { name: "department", type: "department" },
      { name: "color", type: "color" },
      { name: "image", type: "imageUrl" },
      { name: "rating", type: "rating" },
      { name: "isActive", type: "boolean" },
      { name: "createdAt", type: "createdAt" },
    ],
  },
  {
    name: "Social Media Post",
    description: "Publications for social media",
    fields: [
      { name: "id", type: "uuid" },
      { name: "author", type: "author" },
      { name: "avatar", type: "avatar" },
      { name: "content", type: "lorem" },
      { name: "image", type: "imageUrl" },
      { name: "likes", type: "likes" },
      { name: "comments", type: "comments" },
      { name: "createdAt", type: "createdAt" },
    ],
  },
  {
    name: "Blog Article",
    description: "Articles of blog",
    fields: [
      { name: "id", type: "uuid" },
      { name: "title", type: "title" },
      { name: "slug", type: "slug" },
      { name: "excerpt", type: "excerpt" },
      { name: "content", type: "loremLong" },
      { name: "author", type: "author" },
      { name: "publishedAt", type: "publishedAt" },
      { name: "tags", type: "tags" },
      { name: "readTime", type: "readTime" },
    ],
  },
  {
    name: "SaaS User",
    description: "Users of SaaS with subscriptions",
    fields: [
      { name: "id", type: "uuid" },
      { name: "fullName", type: "fullName" },
      { name: "email", type: "email" },
      { name: "company", type: "company" },
      { name: "plan", type: "plan" },
      { name: "mrr", type: "mrr" },
      { name: "status", type: "status" },
      { name: "lastLogin", type: "lastLogin" },
      { name: "joinedAt", type: "joinedAt" },
    ],
  },
  {
    name: "Todo App",
    description: "Tasks for Todo application",
    fields: [
      { name: "id", type: "uuid" },
      { name: "title", type: "todoTitle" },
      { name: "description", type: "description" },
      { name: "completed", type: "completed" },
      { name: "priority", type: "priority" },
      { name: "dueDate", type: "dueDate" },
      { name: "createdAt", type: "createdAt" },
    ],
  },
  {
    name: "Restaurant Menu",
    description: "Dishes for restaurant menu",
    fields: [
      { name: "id", type: "uuid" },
      { name: "name", type: "dishName" },
      { name: "description", type: "description" },
      { name: "price", type: "price" },
      { name: "category", type: "foodCategory" },
      { name: "calories", type: "calories" },
      { name: "vegetarian", type: "vegetarian" },
      { name: "image", type: "imageUrl" },
      { name: "available", type: "boolean" },
      { name: "createdAt", type: "createdAt" },
    ],
  },
  {
    name: "Auth User",
    description: "User with authentication",
    fields: [
      { name: "id", type: "uuid" },
      { name: "username", type: "username" },
      { name: "email", type: "email" },
      { name: "role", type: "role" },
      { name: "status", type: "status" },
      { name: "lastLogin", type: "lastLogin" },
      { name: "createdAt", type: "createdAt" },
    ],
  },
  {
    name: "Auth Session",
    description: "User session",
    fields: [
      { name: "accessToken", type: "jwt" },
      { name: "refreshToken", type: "jwt" },
      { name: "expiresAt", type: "expiresAt" },
      { name: "ip", type: "ip" },
      { name: "userAgent", type: "userAgent" },
    ],
  },
    // E-COMMERCE / PAYMENTS
  {
    name: "Order",
    description: "Client order",
    fields: [
      { name: "id", type: "uuid" },
      { name: "orderNumber", type: "orderNumber" },
      { name: "status", type: "orderStatus" },
      { name: "total", type: "amount" },
      { name: "currency", type: "currency" },
      { name: "itemsCount", type: "quantity" },
      { name: "createdAt", type: "createdAt" },
    ],
  },
  {
    name: "Payment",
    description: "Transaction payment",
    fields: [
      { name: "id", type: "uuid" },
      { name: "provider", type: "paymentProvider" },
      { name: "amount", type: "amount" },
      { name: "currency", type: "currency" },
      { name: "status", type: "paymentStatus" },
      { name: "paidAt", type: "datetime" },
    ],
  },
    // ANALYTICS / DASHBOARD
  {
    name: "Dashboard Stats",
    description: "Global statistics",
    fields: [
      { name: "users", type: "count" },
      { name: "activeUsers", type: "count" },
      { name: "mrr", type: "mrr" },
      { name: "conversionRate", type: "percentage" },
      { name: "churnRate", type: "percentage" },
      { name: "updatedAt", type: "createdAt" },
    ],
  },
  {
    name: "Time Series Metric",
    description: "Time series metric",
    fields: [
      { name: "date", type: "timeSeriesDate" },
      { name: "value", type: "chartValue" },
      { name: "label", type: "metricLabel" },
    ],
  },

  // SUPPORT / COMMUNICATION
  {
    name: "Support Ticket",
    description: "Client support ticket",
    fields: [
      { name: "id", type: "uuid" },
      { name: "subject", type: "title" },
      { name: "status", type: "status" },
      { name: "priority", type: "priority" },
      { name: "message", type: "longMessage" },
      { name: "createdAt", type: "createdAt" },
    ],
  },
  {
    name: "Notification",
    description: "Notification in-app",
    fields: [
      { name: "id", type: "uuid" },
      { name: "type", type: "notificationType" },
      { name: "message", type: "shortMessage" },
      { name: "read", type: "boolean" },
      { name: "createdAt", type: "createdAt" },
    ],
  },

  // MOBILE / DEVICE
  {
    name: "Device",
    description: "User device",
    fields: [
      { name: "id", type: "uuid" },
      { name: "deviceType", type: "deviceType" },
      { name: "os", type: "os" },
      { name: "osVersion", type: "osVersion" },
      { name: "browser", type: "browser" },
      { name: "lastLogin", type: "lastLogin" },
    ],
  },

  // LOGS / SYSTEM
  {
    name: "Audit Log",
    description: "Action log",
    fields: [
      { name: "id", type: "uuid" },
      { name: "action", type: "action" },
      { name: "entity", type: "entity" },
      { name: "actor", type: "author" },
      { name: "createdAt", type: "createdAt" },
    ],
  },
  {
    name: "API Error",
    description: "Standard API error",
    fields: [
      { name: "statusCode", type: "httpStatus" },
      { name: "error", type: "errorCode" },
      { name: "message", type: "errorMessage" },
      { name: "timestamp", type: "timestamp" },
    ],
  },

  // FEATURE FLAGS / CONFIG
  {
    name: "Feature Flag",
    description: "Feature flag management",
    fields: [
      { name: "key", type: "featureKey" },
      { name: "enabled", type: "boolean" },
      { name: "environment", type: "environment" },
    ],
  },
];
