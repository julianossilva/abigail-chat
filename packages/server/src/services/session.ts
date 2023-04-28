import { DateTime } from "../core/timestamp"
import { UserID } from "../model/user"


export class Session {
    public id: string
    public tag: string
    public loggedUser: UserID
    public expiration: DateTime

    constructor(id: string, tag: string, loggedUser: UserID, expiraton: DateTime) {
        this.id = id
        this.tag = tag
        this.loggedUser = loggedUser
        this.expiration = expiraton
    }

    get token(): string {
        return `${this.id}.${this.tag}`
    }
}

export class TokenFormatError extends Error {
    constructor(){
        super("token format error")
    }
}

export class InvalidTokenError extends Error {
    constructor(){
        super("invalid token error")
    }
}

export type CreateOptions = {
    loggedUserID: UserID
    expiration?: DateTime
}

export interface SessionManager {
    create(opts: CreateOptions): Promise<Session>
    find(token: string): Promise<Session | null>
    update(session: Session): Promise<void>
    delete(session: Session): Promise<void>
}