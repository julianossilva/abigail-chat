import { UserID } from "../model/user";
import { MessageRepository } from "../repository/message-repository";
import { UserRepository } from "../repository/user-repository";
import { SessionManager } from "./session";
import { Content, Message, MessageID } from "../model/message";
import { DateTime } from "../core/timestamp";

export class MessageService {
    private _messageRepository: MessageRepository
    private _userRepository: UserRepository
    private _sessionManager: SessionManager

    constructor(messageRepository: MessageRepository, userRepository: UserRepository, sessionManager: SessionManager) {
        this._messageRepository = messageRepository
        this._userRepository = userRepository
        this._sessionManager = sessionManager
    }

    async send(aToken: string, aDestinary: string, aContent: string): Promise<Message> {

        let session = await this._sessionManager.find(aToken);
        if (session == null) throw new Error("session not found")

        let user = await this._userRepository.find(new UserID(aDestinary))
        if (user == null) throw new Error("User not found")

        return await this._messageRepository.create(
            session.loggedUser,
            user.id,
            DateTime.now(),
            new Content(aContent)
        )
    }

    async delete(aToken: string, anID: number) {

        let session = await this._sessionManager.find(aToken);
        if (session == null) throw new Error("session not found")

        let message = await this._messageRepository.find(new MessageID(anID))
        if (message == null) throw new Error("message not found")

        if (!message.from.equal(session.loggedUser)) throw new Error("user cant delete this message")

        await this._messageRepository.delete(message)
    }

    async listAfterID(aToken: string, other: string, id: number, max: number = 50): Promise<[Message[], number]> {
        if (!Number.isInteger(max)) throw new Error("max needs to be an integer")
        if (-1 > max || max > 50) throw new Error("max invalid range")

        let session = await this._sessionManager.find(aToken);
        if (session == null) throw new Error("session not found")

        let currentUser = await this._userRepository.find(session.loggedUser)
        if (currentUser == null) throw new Error("user not found")
        let otherUser = await this._userRepository.find(new UserID(other))
        if (otherUser == null) throw new Error("user not found")

        let [messages, remain] = await this._messageRepository.listAfterID(
            currentUser.id,
            otherUser.id,
            new MessageID(id),
            max
        )

        return [messages, remain]
    }
}