"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { headers } from "next/headers";

export async function updateUserName(formData: FormData) {
  try {
    // Get the session from Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const image = formData.get("image") as string | null;

    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: "Name is required",
      };
    }

    const trimmedName = name.trim();

    // Update the user's name and optionally the image
    await db.user.update({
      where: { id: session.user.id },
      data: { 
        name: trimmedName,
        ...(image && { image }),
      },
    });

    // Find the user's organization and update its name
    const member = await db.member.findFirst({
      where: {
        userId: session.user.id,
        role: "owner",
      },
      include: {
        organization: true,
      },
    });

    if (member?.organization) {
      const newOrgName = `${trimmedName}'s organisation`;
      const newOrgSlug = `${trimmedName.toLowerCase().replace(/\s+/g, '-')}-org-${Date.now()}`;

      await db.organization.update({
        where: { id: member.organization.id },
        data: {
          name: newOrgName,
          slug: newOrgSlug,
        },
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating user name:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
