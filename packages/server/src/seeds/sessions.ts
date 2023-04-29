import { PrismaClient } from "@prisma/client";
import { SessionManagerPrisma } from "../infra/session";
import { User } from "../model/user";
import { Session } from "../services/session";

export async function createSession(user: User): Promise<Session> {
    let prismaClient = new PrismaClient()

    let sessionManager = new SessionManagerPrisma(String(process.env.SECRET_KEY), prismaClient)

    let session = await sessionManager.create({
        loggedUserID: user.id
    })

    await prismaClient.$disconnect()

    return session
}