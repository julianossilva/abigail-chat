import { PrismaClient } from "@prisma/client"
import { UserRepositoryPrisma } from "./user-repository"
import { Email, PasswordHash, User, UserID, Username } from "../model/user";
import { cleanDatabase } from "../seeds/utils";

let prismaClient: PrismaClient


beforeEach(async () => {
    prismaClient = new PrismaClient()
    await cleanDatabase()
})


afterEach(async () => {
    await prismaClient.$disconnect()
    
})

test("create a new user", async () => {

    expect(await prismaClient.user.count()).toBe(0)

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

    expect(user).not.toBeNull()
    expect(user?.id.uuid).toBe("e54a765d-8d9c-456b-9155-0fae19d3b19d")
    expect(user?.email.email).toBe("ana@email.com")
    expect(user?.username.username).toBe("ana")
    expect(user?.hash.hash).toBe("shhh")
})