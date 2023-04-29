import { PrismaClient } from "@prisma/client";
import { Email, PasswordHash, User, UserID, Username } from "../model/user";
import { UserRepositoryPrisma } from "../infra/user-repository";
import crypto from 'crypto'
import { HashManagerImpl } from "../infra/hash-manager";
import { Password } from "../services/auth";

export async function insertUserAna(): Promise<[User, string]> {
    let prismaClient = new PrismaClient()
    let userRepository = new UserRepositoryPrisma(prismaClient);
    let hashManager = new HashManagerImpl()
    let uuid = crypto.randomUUID()
    let pass = crypto.randomBytes(4).toString("hex")

    let user = new User(
        new UserID(uuid),
        new Username("ana"),
        new Email("ana@email.com"),
        await hashManager.hash(new Password(pass))
    )

    await userRepository.create(user)
    await prismaClient.$disconnect()

    return [user, pass]
}

export async function insertUserBob(): Promise<[User, string]> {
    let prismaClient = new PrismaClient()
    let userRepository = new UserRepositoryPrisma(prismaClient);
    let hashManager = new HashManagerImpl()
    let uuid = crypto.randomUUID()
    let pass = crypto.randomBytes(4).toString("hex")

    let user = new User(
        new UserID(uuid),
        new Username("bob"),
        new Email("bob@email.com"),
        await hashManager.hash(new Password(pass))
    )

    await userRepository.create(user)
    await prismaClient.$disconnect()

    return [user, pass]
}