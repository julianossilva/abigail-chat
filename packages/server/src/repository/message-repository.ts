import { Time } from "../core/timestamp";
import { Content, Message, MessageID } from "../model/message";
import { UserID } from "../model/user";

export interface MessageRepository {
    find(messageID: MessageID): Promise<Message|null>
    create(from: UserID, to: UserID, sended: Time, content: Content): Promise<Message>
    delete(message: Message): Promise<void>
}