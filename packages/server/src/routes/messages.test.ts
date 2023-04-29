import { PrismaClient } from "@prisma/client"
import { MessageRepository } from "../repository/message-repository"
import { MessageRepositoryPrisma } from "../infra/message-repository"
import supertest from "supertest"
import { createApp } from "../app"
import { Content, MessageID } from "../model/message"
import { insertUserAna, insertUserBob } from "../seeds/users"
import { createSession } from "../seeds/sessions"
import { cleanDatabase } from "../seeds/utils"
import { DateTime } from "../core/timestamp"


let prismaClient: PrismaClient
let messageRepository: MessageRepository


beforeEach(async () => {
    await cleanDatabase()
    prismaClient = new PrismaClient()

    messageRepository = new MessageRepositoryPrisma(prismaClient)
})

afterEach(async () => {
    await prismaClient.$disconnect()
})

test("send a message", async () => {

    let [ana, anaPassword] = await insertUserAna()
    let [bob, bobPassword] = await insertUserBob()
    let session = await createSession(ana)

    let res = await supertest(createApp())
        .post("/messages/send")
        .set("Authorization", `Bearer ${session.token}`)
        .send({
            to: bob.id.uuid,
            content: "Hello World!"
        })

    expect(res.status).toBe(200)

    let message = await messageRepository.find(new MessageID(Number(res.body.id)))
    expect(message).not.toBeNull()
})

test("get last messages when messages is empty", async () => {
    let [ana, anaPassword] = await insertUserAna()
    let [bob, bobPassword] = await insertUserBob()
    let anaSession = await createSession(ana)

    let messageID = 0; // from start

    let res = await supertest(createApp())
        .get(`/messages/with/${bob.id.uuid}/after/${messageID}`)
        .set("Authorization", `Bearer ${anaSession.token}`)
        .send()

    expect(res.status).toBe(200)
    expect(res.body.remain).toBe(0)
})

test("get last messages when messages is empty", async () => {
    let [ana, anaPassword] = await insertUserAna()
    let [bob, bobPassword] = await insertUserBob()

    let session = await createSession(ana)
    let messageID = 0; // from start

    let firstMessage = await messageRepository.create(ana.id, bob.id, DateTime.now(), new Content("Hello Bob"))
    let secondMessage = await messageRepository.create(bob.id, ana.id, DateTime.now(), new Content("Hi Ana!"))

    let res = await supertest(createApp())
        .get(`/messages/with/${bob.id.uuid}/after/${messageID}`)
        .set("Authorization", `Bearer ${session.token}`)
        .send()

    expect(res.status).toBe(200)
    expect(res.body.messages.length).toBe(2)
    expect(res.body.remain).toBe(0)
})