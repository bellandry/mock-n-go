import { Field } from "../types/mock";
import { generateFieldValue } from "./faker-generator";
import db from "./prisma";

/**
 * Generate a resource ID based on field configuration
 */
export function generateResourceId(fields: Field[]): string {
  // Find ID field
  const idField = fields.find(
    (f) => f.name === "id" || f.name === "_id" || f.name === "ID"
  );

  if (!idField) {
    // No ID field defined, use UUID
    return crypto.randomUUID();
  }

  // Generate ID based on field type
  return String(generateFieldValue(idField));
}

/**
 * Create a new resource
 */
export async function createResource(
  mockConfigId: string,
  data: any,
  fields: Field[]
): Promise<any> {
  // Generate resource ID
  const resourceId = generateResourceId(fields);

  // Add ID to data if not present
  const idField = fields.find(
    (f) => f.name === "id" || f.name === "_id" || f.name === "ID"
  );
  if (idField && !data[idField.name]) {
    data[idField.name] = resourceId;
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
