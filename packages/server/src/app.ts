import express from 'express'
import { authRoutes } from './routes/auth';
import { AuthService } from './services/auth';
import { UUIDGeneratorImpl } from './infra/uuid-generator';
import { HashManagerImpl } from './infra/hash-manager';
import { UserRepositoryPrisma } from './infra/user-repository';
import { PrismaClient } from '@prisma/client';
import { messageRoutes } from './routes/messages';
import { MessageService } from './services/message';
import { MessageRepositoryPrisma } from './infra/message-repository';
import { SessionManagerPrisma } from './infra/session';

export function createApp() {
    let SECRET_KEY= String(process.env.SECRET_KEY)
    const app = express();
    app.use(express.json())

    /**
     * Prisma Client
     */
    let prismaClient = new PrismaClient()

    /**
     * Utilities
     */
    let uuidGenerator = new UUIDGeneratorImpl()
    let hashManager = new HashManagerImpl()
    let sessionManager = new SessionManagerPrisma(SECRET_KEY, prismaClient)

    /**
     * Repositories
     */
    let userRepository = new UserRepositoryPrisma(prismaClient)
    let messageRepository = new MessageRepositoryPrisma(prismaClient)

    /**
     * Services
     */
    let authService = new AuthService(uuidGenerator, hashManager, userRepository, sessionManager)
    let messageService = new MessageService(messageRepository, userRepository, sessionManager)

    /**
     * Routes
     */
    app.use(authRoutes(authService))
    app.use(messageRoutes(messageService))

    return app
}
