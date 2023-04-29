import supertest from 'supertest'
import { createApp } from '../app';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../repository/user-repository';
import { UserRepositoryPrisma } from '../infra/user-repository';
import { Email, PasswordHash, User, UserID, Username } from '../model/user';
import { UUIDGenerator } from '../services/uuid';
import { UUIDGeneratorImpl } from '../infra/uuid-generator';
import { HashManager } from '../services/hash';
import { HashManagerImpl } from '../infra/hash-manager';
import { Password } from '../services/auth';
import { cleanDatabase } from '../seeds/utils';

let prismaClient: PrismaClient;
let userRepository: UserRepository;
let uuidGenerator: UUIDGenerator;
let hashManager: HashManager;





beforeEach(async () => {
    prismaClient = new PrismaClient()
    userRepository = new UserRepositoryPrisma(prismaClient)
    uuidGenerator = new UUIDGeneratorImpl()
    hashManager = new HashManagerImpl()

    cleanDatabase()
})

afterEach(async () => {
    await prismaClient.$disconnect()
})

test("register with empty body", async () => {
    const app = createApp()

    let res = await supertest(app)
        .post('/signup')

    expect(res.status).toBe(400)
    expect(res.body.message).toContain("param error")
})

test("register user", async () => {
    const app = createApp()

    let res = await supertest(app)
        .post('/signup')
        .send({
            username: "ana",
            email: "ana@email.com",
            password: "12345678"
        })

    expect(res.status).toBe(201)
})

test("sign in with a valid user", async () => {

    let uuid = await uuidGenerator.v4()
    let password = new Password("asdfasdf")

    await userRepository.create(
        new User(
            new UserID(uuid),
            new Username("ana"),
            new Email("ana@email.com"),
            await hashManager.hash(password)
        )
    )

    const app = createApp()

    let res = await supertest(app)
        .post('/signin')
        .send({
            username: "ana",
            password: "asdfasdf"
        })

    expect(res.status).toBe(200)
})