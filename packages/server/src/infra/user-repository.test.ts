import { PrismaClient } from "@prisma/client"
import { UserRepositoryPrisma } from "./user-repository"
import { Email, PasswordHash, User, UserID, Username } from "../model/user";
import { Password } from "../services/auth";

let prismaClient: PrismaClient

beforeEach(async () => {
    prismaClient = new PrismaClient()
    await prismaClient.user.deleteMany()
})

afterEach(async () => {
    await prismaClient.$disconnect()
})

test("create user", async () => {

    if ((await prismaClient.user.count()) != 0) {
        throw new Error("non empty users")
    }

    let userRepositoryPrisma = new UserRepositoryPrisma(prismaClient);

    let userID = new UserID("e54a765d-8d9c-456b-9155-0fae19d3b19d")
    let username = new Username("ana")
    let email = new Email("ana@email.com")
    let passwordHash = new PasswordHash("shhhh")

    let user = new User(
        userID,
        username,
        email,
        passwordHash
    )

    await userRepositoryPrisma.create(user)

    if ((await prismaClient.user.count()) != 1) {
        throw new Error("user no created")
    }

    await prismaClient.$disconnect()
})

test("find user", async () => {
    let userRepositoryPrisma = new UserRepositoryPrisma(prismaClient);

    await prismaClient.user.create({
        data: {
            id: "e54a765d-8d9c-456b-9155-0fae19d3b19d",
            email: "ana@email.com",
            hash: "shhh",
            username: "ana"
        }
    })

    let userRepository = new UserRepositoryPrisma(prismaClient)

    let user = await userRepository.find(new UserID("e54a765d-8d9c-456b-9155-0fae19d3b19d"))

    if (user == null) throw new Error("user not finded")
    if (user.id.uuid != "e54a765d-8d9c-456b-9155-0fae19d3b19d") {
        throw new Error("user saved with wrong data")
    }
    if (user.email.email != "ana@email.com") {
        throw new Error("user saved with wrong data")
    }
    if (user.username.username != "ana") {
        throw new Error("user saved with wrong data")
    }
    if (user.hash.hash != "shhh") {
        throw new Error("user saved with wrong data")
    }
})