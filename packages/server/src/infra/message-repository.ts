import { Prisma, PrismaClient } from "@prisma/client";
import { Time } from "../core/timestamp";
import { Content, Message, MessageID } from "../model/message";
import { UserID } from "../model/user";
import { MessageRepository } from "../repository/message-repository";

export class MessageRepositoryPrisma implements MessageRepository {
    private _prismaClient: PrismaClient

    constructor(prisma: PrismaClient) {
        this._prismaClient = prisma
    }

    async find(messageID: MessageID): Promise<Message | null> {
        let messageData = await this._prismaClient.message.findUnique({
            where: {
                id: messageID.id
            }
        })

        if (messageData == null) return null

        return new Message(
            new MessageID(messageData.id),
            new UserID(messageData.fromId),
            new UserID(messageData.toId),
            new Time(messageData.date.toISOString()),
            new Content(messageData.content)
        )
    }

    async create(from: UserID, to: UserID, sended: Time, content: Content): Promise<Message> {
        let messageData = await this._prismaClient.message.create({
            data: {
                fromId: from.uuid,
                toId: to.uuid,
                date: sended.isoString(),
                content: content.text
            }
        })

        return new Message(
            new MessageID(messageData.id),
            new UserID(messageData.fromId),
            new UserID(messageData.toId),
            new Time(messageData.date.toISOString()),
            new Content(messageData.content)
        )
    }

    async delete(message: Message): Promise<void> {
        await this._prismaClient.message.delete({
            where: {
                id: message.id.id
            }
        })
    }
}