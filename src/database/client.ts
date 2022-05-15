import type {} from "./client.d";
import { PrismaClient } from "@prisma/client";

// make sure there's only ever one prisma client instance
// ignore the DONOTUSE -- this *is* the only intended internal use
globalThis.__DONOTUSE_prismaClientSingletonInstance ??= new PrismaClient();
export const prisma = globalThis.__DONOTUSE_prismaClientSingletonInstance;
