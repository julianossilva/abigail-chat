import express from 'express'
import { authRoutes } from './routes/auth';
import { AuthService } from './services/auth';
import { UUIDGeneratorImpl } from './infra/uuid-generator';
import { HashManagerImpl } from './infra/hash-manager';
import { UserRepositoryPrisma } from './infra/user-repository';
import { PrismaClient } from '@prisma/client';

export function createApp() {
    const app = express();
    app.use(express.json())

    let uuidGenerator = new UUIDGeneratorImpl()
    let hashManager = new HashManagerImpl()


    let prismaClient = new PrismaClient()
    let userRepository = new UserRepositoryPrisma(prismaClient)
    let authService = new AuthService(uuidGenerator, hashManager, userRepository)

    app.use(authRoutes(authService))

    return app
}