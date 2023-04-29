import { DateTime } from "../core/timestamp";
import { Content, Message, MessageID } from "../model/message";
import { UserID } from "../model/user";

export interface MessageRepository {
    find(messageID: MessageID): Promise<Message|null>
    create(from: UserID, to: UserID, sended: DateTime, content: Content): Promise<Message>
    delete(message: Message): Promise<void>
    listAfterID(id1: UserID, id2: UserID, messageID: MessageID, max: number): Promise<[Message[], number]> 
}