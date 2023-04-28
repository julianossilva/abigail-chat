import { PrismaClient } from "@prisma/client"
import { MessageRepositoryPrisma } from "./message-repository"
import { UserID } from "../model/user"
import { Content, MessageID } from "../model/message"
import { DateTime } from "../core/timestamp"

let prismaClient: PrismaClient

beforeEach(async () => {
    prismaClient = new PrismaClient()

    await prismaClient.message.deleteMany()
})

afterEach(async () => {
    await prismaClient.$disconnect()
})

test("create messages", async () => {
    let messageRepository = new MessageRepositoryPrisma(prismaClient)

    let from = "921cb7e2-b2aa-4c0d-8b70-cc4cbaf98764"
    let to = "c321f47e-6266-4df4-84d3-d4e78100a50f"
    let sended = "2023-04-26T22:48:07.298Z"
    let content = "Hello World!"

    let message = await messageRepository.create(
        new UserID(from),
        new UserID(to),
        new DateTime(sended),
        new Content(content)
    )

    let n = await prismaClient.message.count()
    if (n != 1) throw new Error("message counting error")

    let messageData = await prismaClient.message.findFirst()
    if (messageData == null) throw new Error("messager find error")

    expect(messageData.fromId).toBe(from)
    expect(messageData.toId).toBe(to)
    expect(messageData.date.toISOString()).toBe(sended)
    expect(messageData.content).toBe(content)

})

test("delete messages",async () => {

    let messageRepository = new MessageRepositoryPrisma(prismaClient)

    let from = "921cb7e2-b2aa-4c0d-8b70-cc4cbaf98764"
    let to = "c321f47e-6266-4df4-84d3-d4e78100a50f"
    let sended = "2023-04-26T22:48:07.298Z"
    let content = "Hello World!"

    let messageData = await prismaClient.message.create({
        data: {
            fromId: from,
            toId: to,
            date: sended,
            content: content
        }
    })

    let message = await messageRepository.find(new MessageID(messageData.id))

    if (message == null) throw new Error("null message")

    await messageRepository.delete(message)
    let n = await prismaClient.message.count()
    expect(n).toBe(0)
})