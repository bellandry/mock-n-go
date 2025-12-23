import { Field } from "../types/mock";
import { generateFieldValue } from "./faker-generator";
import db from "./prisma";
import { getEffectivePlan, getOrganizationSubscription } from "./subscription-helpers";
import { SUBSCRIPTION_LIMITS } from "./subscription-limits";

/**
 * Generate a resource ID based on field configuration
 */
function generateResourceId(fields: Field[]): string {
  const idField = fields.find(
    (f) => f.name === "id" || f.name === "_id" || f.name === "ID"
  );

  if (!idField) {
    return Math.random().toString(36).substring(2, 15);
  }

  return String(generateFieldValue(idField));
}

/**
 * Create a new resource for a mock
 */
export async function createResource(
  mockConfigId: string,
  data: any,
  fields: Field[]
): Promise<any> {
  // Get mock config to find organization
  const mockConfig = await db.mockConfig.findUnique({
    where: { id: mockConfigId },
    select: { organizationId: true },
  });

  if (!mockConfig) {
    throw new Error("Mock config not found");
  }

  // Check subscription-based record limit
  const subscription = await getOrganizationSubscription(mockConfig.organizationId);
  const effectivePlan = getEffectivePlan(subscription);
  const limits = SUBSCRIPTION_LIMITS[effectivePlan];

  // -1 means unlimited
  if (limits.maxRecordsPerMock !== -1) {
    const currentCount = await getResourceCount(mockConfigId);
    if (currentCount >= limits.maxRecordsPerMock) {
      throw new Error(
        `Record limit reached. ${effectivePlan} plan allows up to ${limits.maxRecordsPerMock} records per mock. Upgrade your plan for more storage.`
      );
    }
  }

  // Find ID field in schema
  const idField = fields.find(
    (f) => f.name === "id" || f.name === "_id" || f.name === "ID"
  );

  // Use ID from data if available, otherwise generate one
  let resourceId: string;
  if (idField && data[idField.name]) {
    resourceId = data[idField.name];
  } else {
    resourceId = generateResourceId(fields);
    // Add generated ID to data if ID field exists
    if (idField) {
      data[idField.name] = resourceId;
    }
  }

  // Add timestamps
  const now = new Date().toISOString();
  data.createdAt = now;
  data.updatedAt = now;

  // Store in database
  const stored = await db.mockData.create({
    data: {
      mockConfigId,
      resourceId,
      data: data as any,
    },
  });

  // Check if we need to cleanup old data (limit: 1000 entries)
  const count = await db.mockData.count({
    where: { mockConfigId },
  });

  if (count > 1000) {
    await cleanupOldData(mockConfigId);
  }

  return stored.data;
}

/**
 * Seed random data for a mock
 */
export async function seedRandomData(
  mockConfigId: string,
  fields: Field[],
  count: number
): Promise<any[]> {
  // Get mock config to find organization
  const mockConfig = await db.mockConfig.findUnique({
    where: { id: mockConfigId },
    select: { organizationId: true },
  });

  if (!mockConfig) {
    throw new Error("Mock config not found");
  }

  // Check subscription-based record limit
  const subscription = await getOrganizationSubscription(mockConfig.organizationId);
  const effectivePlan = getEffectivePlan(subscription);
  const limits = SUBSCRIPTION_LIMITS[effectivePlan];

  const currentCount = await getResourceCount(mockConfigId);

  // -1 means unlimited
  if (limits.maxRecordsPerMock !== -1) {
    const availableSlots = limits.maxRecordsPerMock - currentCount;
    
    if (availableSlots <= 0) {
      throw new Error(
        `Record limit reached. ${effectivePlan} plan allows up to ${limits.maxRecordsPerMock} records per mock.`
      );
    }
    
    // Limit the count to available slots
    count = Math.min(count, availableSlots);
  }
  
  const { generateMockData } = await import("./faker-generator");
  const mockData = generateMockData(fields, count);
  
  const createdResources = [];
  
  for (const data of mockData) {
    const resource = await createResource(mockConfigId, data, fields);
    createdResources.push(resource);
  }
  
  return createdResources;
}

/**
 * Get all resources for a mock
 */
export async function getResources(
  mockConfigId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ data: any[]; total: number }> {
  const skip = (page - 1) * limit;

  const [resources, total] = await Promise.all([
    db.mockData.findMany({
      where: { mockConfigId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.mockData.count({
      where: { mockConfigId },
    }),
  ]);

  return {
    data: resources.map((r: any) => r.data),
    total,
  };
}

/**
 * Get a single resource by ID
 */
export async function getResourceById(
  mockConfigId: string,
  resourceId: string
): Promise<any | null> {
  const resource = await db.mockData.findUnique({
    where: {
      mockConfigId_resourceId: {
        mockConfigId,
        resourceId,
      },
    },
  });
  console.log("resource", resource);

  return resource ? resource.data : null;
}

/**
 * Replace a resource (PUT)
 */
export async function replaceResource(
  mockConfigId: string,
  resourceId: string,
  data: any
): Promise<any> {
  // Update timestamp
  data.updatedAt = new Date().toISOString();

  const updated = await db.mockData.update({
    where: {
      mockConfigId_resourceId: {
        mockConfigId,
        resourceId,
      },
    },
    data: {
      data: data as any,
      updatedAt: new Date(),
    },
  });

  return updated.data;
}

/**
 * Update a resource partially (PATCH)
 */
export async function updateResource(
  mockConfigId: string,
  resourceId: string,
  partialData: Partial<any>
): Promise<any> {
  // Get existing data
  const existing = await getResourceById(mockConfigId, resourceId);
  if (!existing) {
    throw new Error("Resource not found");
  }

  // Merge with existing data
  const merged = {
    ...existing,
    ...partialData,
    updatedAt: new Date().toISOString(),
  };

  const updated = await db.mockData.update({
    where: {
      mockConfigId_resourceId: {
        mockConfigId,
        resourceId,
      },
    },
    data: {
      data: merged as any,
      updatedAt: new Date(),
    },
  });

  return updated.data;
}

/**
 * Delete a resource
 */
export async function deleteResource(
  mockConfigId: string,
  resourceId: string
): Promise<boolean> {
  try {
    await db.mockData.delete({
      where: {
        mockConfigId_resourceId: {
          mockConfigId,
          resourceId,
        },
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Delete all resources for a mock
 */
export async function deleteAllResources(mockConfigId: string): Promise<number> {
  const result = await db.mockData.deleteMany({
    where: { mockConfigId },
  });
  return result.count;
}

/**
 * Cleanup old data when limit is exceeded
 * Keeps the 900 most recent entries
 */
async function cleanupOldData(mockConfigId: string): Promise<void> {
  // Get IDs of oldest entries to delete
  const toDelete = await db.mockData.findMany({
    where: { mockConfigId },
    orderBy: { createdAt: "asc" },
    take: 100, // Delete 100 oldest entries
    select: { id: true },
  });

  if (toDelete.length > 0) {
    await db.mockData.deleteMany({
      where: {
        id: {
          in: toDelete.map((d) => d.id),
        },
      },
    });
  }
}

/**
 * Get resource count for a mock
 */
export async function getResourceCount(mockConfigId: string): Promise<number> {
  return await db.mockData.count({
    where: { mockConfigId },
  });
}
