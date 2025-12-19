import db from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink, oneTap, organization } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, ctx) => {
        // send email to user
        console.log(email, token, url);
      },
    }),
    oneTap(),
    organization({
      async sendInvitationEmail(data) {
        // send invitation email to user
        console.log(data);
      },
      organizationHooks: {
        // This hook is not for signup, we'll use a different approach
      },
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Automatically create an organization for the new user
          const organizationName = `${user.name}'s organisation`;
          const organizationSlug = `${user.name.toLowerCase().replace(/\s+/g, '-')}-org-${Date.now()}`;
        
          try {
            // Create organization directly in the database
            const organization = await db.organization.create({
              data: {
                id: crypto.randomUUID(),
                name: organizationName,
                slug: organizationSlug,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });

            // Add user as owner member
            await db.member.create({
              data: {
                id: crypto.randomUUID(),
                organizationId: organization.id,
                userId: user.id,
                role: "owner",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          } catch (error) {
            console.error("Error creating organization for new user:", error);
          }
        },
      }
    }
  },
});
