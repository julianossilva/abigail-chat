import { Email, PasswordHash, User, UserID, Username } from "../model/user";
import { EmailAlreadyInUse, IDAlreadInUse, UserRepository, UsernameAlreadyInUse } from "../repository/user-repository";

import { PrismaClient } from '@prisma/client'

export class UserRepositoryPrisma implements UserRepository {

    private _prismaClient: PrismaClient;

    constructor(client: PrismaClient) {
        this._prismaClient = client
    }

    async create(user: User): Promise<void> {
        let usersWithID = await this._prismaClient.user.count({
            where: {
                id: user.id.uuid
            }
        })
        if (usersWithID > 0) throw new IDAlreadInUse()

        let usersWithUsername = await this._prismaClient.user.count({
            where: {
                username: user.username.username
            }
        })
        if (usersWithUsername > 0) throw new UsernameAlreadyInUse()

        let usersWithEmail = await this._prismaClient.user.count({
            where: {
                email: user.email.email
            }
        })
        if (usersWithEmail > 0) throw new EmailAlreadyInUse()

        let res = await this._prismaClient.user.create({

            data: {
                id: user.id.uuid,
                email: user.email.email,
                username: user.username.username,
                hash: user.hash.hash,
            }
        })
    }

    async find(userID: UserID): Promise<User | null> {
        let userData = await this._prismaClient.user.findUnique({
            where: {
                id: userID.uuid
            }
        })

        if (!userData) return null

        return new User(
            new UserID(userData.id),
            new Username(userData.username),
            new Email(userData.email),
            new PasswordHash(userData.hash)
        )
    }

    async findByUsername(username: Username): Promise<User | null> {
        let userData = await this._prismaClient.user.findUnique({
            where: {
                username: username.username
            }
        })

        if (!userData) return null

        return new User(
            new UserID(userData.id),
            new Username(userData.username),
            new Email(userData.email),
            new PasswordHash(userData.hash)
        )
    }
}