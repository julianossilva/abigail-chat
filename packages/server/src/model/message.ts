import { Time } from "../core/timestamp"
import { UserID } from "./user"

export class MessageID {
    private _id: number

    constructor(id: number) {
        this._id = id
    }

    get id(): number {
        return this._id
    }

    equal(other: MessageID): boolean {
        return other.id == other.id
    }
}

export class ContentSizeError extends Error {
    constructor() {
        super("content size error")
    }
}

export class Content {
    private _text: string

    constructor(text: string) {
        if (text.length > 255) {
            throw new ContentSizeError()
        }
        this._text = text
    }

    get text(): string {
        return this._text
    }

    equal(other: Content): boolean {
        return this.text == other.text
    }
}

export class Message {
    private _id: MessageID
    private _from: UserID
    private _to: UserID;

    private _sended: Time
    private _content: Content

    constructor(id: MessageID, from: UserID, to: UserID, sended: Time, content: Content) {
        this._id = id
        this._from = from;
        this._to = to;
        this._sended = sended
        this._content = content
    }

    get id(): MessageID {
        return this._id
    }

    get from(): UserID {
        return this._from
    }

    get to(): UserID {
        return this._to
    }

    get sended(): Time {
        return this._sended
    }

    get content(): Content {
        return this._content
    }

    equal(other: Message): boolean {
        return this.id.equal(other.id)
    }
}
