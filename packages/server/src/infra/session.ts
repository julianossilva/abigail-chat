import { PrismaClient } from "@prisma/client";
import { CreateOptions, InvalidTokenError, Session, SessionManager, TokenFormatError } from "../services/session";
import { UserID } from "../model/user";
import { DAY, DateTime } from "../core/timestamp";
import crypto from "crypto"

export class SessionManagerPrisma implements SessionManager {
    private _prismaClienbt: PrismaClient
    private _secretKey: string

    constructor(secretKey: string, prisma: PrismaClient) {
        this._prismaClienbt = prisma
        this._secretKey = secretKey
    }

    async create(opts: CreateOptions): Promise<Session> {
        let id = genID()
        let userId = opts.loggedUserID.uuid
        let expiration = opts.expiration?.isoString() ?? DateTime.now().add(1 * DAY).isoString()

        let sessionData = await this._prismaClienbt.session.create({
            data: {
                id,
                expiration: expiration,
                userId
            }
        })

        return new Session(
            sessionData.id,
            genTag(sessionData.id, this._secretKey),
            new UserID(sessionData.userId),
            new DateTime(sessionData.expiration.toISOString())
        )
    }

    async find(token: string): Promise<Session | null> {
        let parts = token.split(".")
        if (parts.length != 2) throw new TokenFormatError()

        let id = parts[0]
        let tag = parts[1]

        if (genTag(id, this._secretKey) != tag) throw new InvalidTokenError()

        let sessionData = await this._prismaClienbt.session.findFirst({
            where: {
                id: id
            }
        })

        if (sessionData == null) return null

        return new Session(
            sessionData.id,
            tag,
            new UserID(sessionData.userId),
            new DateTime(sessionData.expiration.toISOString())
        )
    }

    async update(session: Session): Promise<void> {
        await this._prismaClienbt.session.update({
            data: {
                expiration: session.expiration.isoString()
            },
            where: {
                id: session.id
            }
        })
    }

    async delete(session: Session): Promise<void> {
        await this._prismaClienbt.session.delete({
            where: {
                id: session.id
            }
        })
    }
}

function genID(): string {
    return crypto.randomBytes(127).toString("hex")
}

function genTag(id: string, secret: string): string {
    let hmac = crypto.createHmac('sha256', secret);

    hmac.update(id)

    return hmac.digest("hex")
}