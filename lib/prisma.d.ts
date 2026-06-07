import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
declare const prisma: PrismaClient<{
    log: ("query" | "warn" | "error")[];
}, "query" | "warn" | "error", import("@prisma/client/runtime/library").DefaultArgs>;
export { prisma };
