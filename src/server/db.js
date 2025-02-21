import { PrismaClient } from "@prisma/client"

export const generateClient = ()=>{
    // global.prisma = new PrismaClient();
    if (!global.prisma) global.prisma = new PrismaClient();
    return global.prisma
}