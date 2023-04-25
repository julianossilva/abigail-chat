import { User } from "../model/user";
import { UserRepository } from "../repository/user-repository";

import prisma from '../generated/client'

export class UserRepositoryPrisma implements UserRepository{
    create(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
}