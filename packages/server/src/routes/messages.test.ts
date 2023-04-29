import { PrismaClient } from "@prisma/client"
import { UserRepositoryPrisma } from "../infra/user-repository"
import { UserRepository } from "../repository/user-repository"
import { SessionManager } from "../services/session"
import { MessageRepository } from "../repository/message-repository"
import { MessageRepositoryPrisma } from "../infra/message-repository"
import { SessionManagerPrisma } from "../infra/session"
import { Email, PasswordHash, User, UserID, Username } from "../model/user"
import { UUIDGeneratorImpl } from "../infra/uuid-generator"
import { UUIDGenerator } from "../services/uuid"
import { HashManager } from "../services/hash"
import { HashManagerImpl } from "../infra/hash-manager"
import { Password } from "../services/auth"
import supertest from "supertest"
import { createApp } from "../app"
import { MessageID } from "../model/message"


let prismaClient: PrismaClient
let userRepository: UserRepository
let messageRepository: MessageRepository
let sessionManager: SessionManager
let uuidGenerator: UUIDGenerator
let hashManager: HashManager

beforeEach(async () => {
    prismaClient = new PrismaClient()
    userRepository = new UserRepositoryPrisma(prismaClient)
    messageRepository = new MessageRepositoryPrisma(prismaClient)
    sessionManager = new SessionManagerPrisma("shhh", prismaClient)
    uuidGenerator = new UUIDGeneratorImpl()
    hashManager = new HashManagerImpl()

    await prismaClient.user.deleteMany()
    await prismaClient.session.deleteMany()
    await prismaClient.message.deleteMany()
})

afterEach(async () => {
    await prismaClient.$disconnect()
})

test("send a message", async () => {

    let uuid1 = await uuidGenerator.v4()
    let uuid2 = await uuidGenerator.v4()

    let password1 = "12345678"
    let password2 = "asdfasdf"

    let user1 = new User(
        new UserID(uuid1),
        new Username("ana"),
        new Email("ana@email.com"),
        await hashManager.hash(new Password(password1))
    )

    let user2 = new User(
        new UserID(uuid2),
        new Username("bob"),
        new Email("bob@email.com"),
        await hashManager.hash(new Password(password2))
    )

    await userRepository.create(user1)
    await userRepository.create(user2)

    let session = await sessionManager.create({
        loggedUserID: user1.id
    })

    let res = await supertest(createApp())
        .post("/messages/send")
        .set("Authorization", `Bearer ${session.token}`)
        .send({
            to: user2.id.uuid,
            content: "Hello World!"
        })
    
    expect(res.status).toBe(200)

    let message = await messageRepository.find(new MessageID(Number(res.body.id)))
    expect(message).not.toBeNull()
})