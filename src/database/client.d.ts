import { PrismaClient } from "@prisma/client";

declare global {
	var __DONOTUSE_prismaClientSingletonInstance: PrismaClient;
}

export {};
