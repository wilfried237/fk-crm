import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user) {
            throw new Error("User not found");
          }

          // Check if user has a password (OAuth users might not have one)
          if (!user.password) {
            throw new Error("Invalid credentials");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Credentials authorization error:', error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account}) {
      // Handle OAuth sign-in
      if (account?.provider === "google" || account?.provider === "github") {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });

        if (!existingUser) {
          // Create new user for OAuth
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              image: user.image!,
              role: "USER",
              emailVerified: new Date(),
            }
          });
          user.id = newUser.id;
          user.role = newUser.role;
        } else {
          // Update existing user with OAuth info
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: user.name || existingUser.name,
              image: user.image || existingUser.image,
              emailVerified: new Date(),
            }
          });
          user.id = existingUser.id;
          user.role = existingUser.role;
        }
      }
      return true;
    },
    async jwt({ token, user}) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 