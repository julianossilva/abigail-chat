import { Email, PasswordHash, User, UserID, Username } from "../model/user";
import { UserRepository } from "../repository/user-repository";

import { PrismaClient } from '@prisma/client'

export class UserRepositoryPrisma implements UserRepository {

    private _prismaClient: PrismaClient;

    constructor(client: PrismaClient) {
        this._prismaClient = client
    }

    async create(user: User): Promise<void> {
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
}