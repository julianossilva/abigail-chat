import { DateTime } from "luxon";
import { Content, Message, MessageID } from "../model/message";
import { UserID } from "../model/user";

export interface MessageRepository {
    find(messageID: MessageID): Promise<Message|null>
    create(from: UserID, to: UserID, sended: DateTime, content: Content): Promise<Message>
    delete(message: Message): Promise<void>
}