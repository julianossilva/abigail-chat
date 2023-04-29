import { PrismaClient } from "@prisma/client";
import { DateTime } from "../core/timestamp";
import { Content, Message, MessageID } from "../model/message";
import { UserID } from "../model/user";
import { MessageRepository } from "../repository/message-repository";

export class MessageRepositoryPrisma implements MessageRepository {
    private _prismaClient: PrismaClient

    constructor(prisma: PrismaClient) {
        this._prismaClient = prisma
    }

    async listAfterID(id1: UserID, id2: UserID, messageID: MessageID, max: number): Promise<[Message[], number]> {
        return await this._prismaClient.$transaction(async tx => {
            let n = await tx.message.count({
                where: {
                    OR: [
                        {
                            id: { gt: messageID.id },
                            fromId: id1.uuid,
                            toId: id2.uuid
                        },
                        {
                            id: { gt: messageID.id },
                            fromId: id2.uuid,
                            toId: id1.uuid
                        }
                    ]
                },

            })

            let messagesData = await tx.message.findMany({
                where: {
                    OR: [
                        {
                            id: { gt: messageID.id },
                            fromId: id1.uuid,
                            toId: id2.uuid
                        },
                        {
                            id: { gt: messageID.id },
                            fromId: id2.uuid,
                            toId: id1.uuid
                        }
                    ]
                },
                orderBy: {
                    id: "asc"
                },
                take: max
            })

            let remain = n - messagesData.length

            let messages: Message[] = messagesData.map(data => {
                return new Message(
                    new MessageID(data.id),
                    new UserID(data.fromId),
                    new UserID(data.toId),
                    new DateTime(data.date.toISOString()),
                    new Content(data.content)
                )
            })

            return [messages, remain]
        })
    }

    async create(from: UserID, to: UserID, sended: DateTime, content: Content): Promise<Message> {
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
            new DateTime(messageData.date.toISOString()),
            new Content(messageData.content)
        )
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
            new DateTime(messageData.date.toISOString()),
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