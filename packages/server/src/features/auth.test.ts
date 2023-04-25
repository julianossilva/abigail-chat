import express from 'express'
import { authRoutes } from '../routes/auth';
import { AuthService, Password } from '../services/auth';
import { UUIDGenerator } from '../services/uuid';
import { HashManager } from '../services/hash';
import { PasswordHash, User } from '../model/user';
import { UserRepository } from '../repository/user-repository';
import supertest from 'supertest'

class MockUUIDGenerator implements UUIDGenerator {
    async v4(): Promise<string> {
        return "87723768-fe25-442d-81cc-155825552566"
    }
}

class MockHashManager implements HashManager {
    async hash(password: Password): Promise<PasswordHash> {
        return new PasswordHash(password.password)
    }
}

class MockUserRepository implements UserRepository {
    async create(user: User): Promise<void> { }
}

test("register with empty body", async () => {
    const app = express();
    app.use(express.json())

    let uuidGenMock = new MockUUIDGenerator()
    let hashGenMock = new MockHashManager()
    let userRepository = new MockUserRepository()

    let auth = new AuthService(uuidGenMock, hashGenMock, userRepository)

    app.use(authRoutes(auth))

    let res = await supertest(app)
        .post('/signup')

    expect(res.status).toBe(400)
    expect(res.body.message).toContain("param error")
})


test("register user", async () => {
    const app = express();
    app.use(express.json())

    let uuidGenMock = new MockUUIDGenerator()
    let hashGenMock = new MockHashManager()
    let userRepository = new MockUserRepository()

    let auth = new AuthService(uuidGenMock, hashGenMock, userRepository)

    app.use(authRoutes(auth))

    let res = await supertest(app)
        .post('/signup')
        .send({
            username: "ana",
            email: "ana@email.com",
            password: "12345678"
        })

    expect(res.status).toBe(201)
})