import express from 'express'
import { authRoutes } from '../routes/auth';
import { AuthService, Password } from '../services/auth';
import { UUIDGenerator } from '../services/uuid';
import { HashManager } from '../services/hash';
import { PasswordHash, User, UserID, Username } from '../model/user';
import { UserRepository, UserRepositoryInMemory } from '../repository/user-repository';
import supertest from 'supertest'
import { createApp } from '../app';
import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient;

beforeEach(async () => {
    prismaClient = new PrismaClient()

    await prismaClient.user.deleteMany()
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