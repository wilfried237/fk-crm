import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // You might want to use a different PrismaClient instance
  // during development, perhaps connecting to a local database.
  prisma = new PrismaClient({
    // ...options for development environment
  });
}

export {prisma};
