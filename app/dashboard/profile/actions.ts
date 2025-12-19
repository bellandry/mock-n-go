"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

/**
 * Update user's name
 */
export async function updateUserName(name: string) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Validate name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return {
        success: false,
        error: "Name is required",
      };
    }

    if (name.trim().length > 100) {
      return {
        success: false,
        error: "Name is too long (max 100 characters)",
      };
    }

    // Update user in database
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
      },
    });

    // Revalidate the profile page
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
    };
  } catch (error) {
    console.error("Name update error:", error);
    return {
      success: false,
      error: "Failed to update name",
    };
  }
}

/**
 * Update user's profile image
 */
export async function updateUserImage(imageUrl: string) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Validate image URL
    if (!imageUrl || typeof imageUrl !== "string") {
      return {
        success: false,
        error: "Invalid image URL",
      };
    }

    // Update user in database
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        image: imageUrl,
      },
    });

    // Revalidate the profile page
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
    };
  } catch (error) {
    console.error("Image update error:", error);
    return {
      success: false,
      error: "Failed to update image",
    };
  }
}
