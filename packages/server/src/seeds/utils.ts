import { PrismaClient } from "@prisma/client";

export async function cleanDatabase() {
    let prismaClient = new PrismaClient()

    await prismaClient.message.deleteMany()
    await prismaClient.session.deleteMany()
    await prismaClient.user.deleteMany()

    await prismaClient.$disconnect()
}