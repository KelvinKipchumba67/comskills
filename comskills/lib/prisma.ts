import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createClient() {
    const adapter = new PrismaPg(
        {
            // query params are dropped here; the schema is set in the second argument instead
            connectionString: process.env.DATABASE_URL!.split("?")[0],
            ssl: { rejectUnauthorized: false },
        },
        { schema: "comskill" }
    );
    return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createClient> };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;