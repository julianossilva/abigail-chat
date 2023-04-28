import { DateTime } from "luxon";
import { UserID } from "../model/user";
import { MessageRepository } from "../repository/message-repository";
import { UserRepository } from "../repository/user-repository";
import { SessionManager } from "./session";
import { Content, MessageID } from "../model/message";

export class MessageService {
    private _messageRepository: MessageRepository
    private _userRepository: UserRepository
    private _sessionManager: SessionManager

    constructor(messageRepository: MessageRepository, userRepository: UserRepository, sessionManager: SessionManager) {
        this._messageRepository = messageRepository
        this._userRepository = userRepository
        this._sessionManager = sessionManager
    }

    async send(aToken: string, aDestinary: string, aContent: string) {

        let session = await this._sessionManager.find(aToken);
        if (session == null) throw new Error("session not found")

        let user = await this._userRepository.find(new UserID(aDestinary))
        if (user == null) throw new Error("User not found")

        await this._messageRepository.create(
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
}