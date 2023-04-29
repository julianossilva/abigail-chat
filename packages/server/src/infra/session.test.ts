import { PrismaClient } from "@prisma/client"
import { SessionManagerPrisma } from "./session"
import { UserID } from "../model/user"
import { DAY, DateTime } from "../core/timestamp"

let prismaClient: PrismaClient

beforeEach(async () => {
    prismaClient = new PrismaClient()

    await prismaClient.session.deleteMany()
})

afterEach(async () => {
    await prismaClient.$disconnect()
})

test("create a session", async () => {
    let sessionManager = new SessionManagerPrisma("shhh", prismaClient)
    let userID = new UserID("8c41eb7a-922b-4f66-aa73-e6c9f255d8e7")

    let session = await sessionManager.create({
        loggedUserID: userID
    })

    let token = session.token

    let sessionsCount = await prismaClient.session.count()
    expect(sessionsCount).toBe(1)

    let fistSession = await prismaClient.session.findFirstOrThrow()
    expect(fistSession.userId).toBe(userID.uuid)
})

test("find session", async () => {

    let key = "shhh"
    let id = "9af5929aa44ecab0023a3a2901e3221952aa30f19ef8c7d33e1f536e6a424a73fab8837caf14ad82e56cf9dbb11c71072dd0ab065d09abe57f2154f09851b2c2a5003d622c10decb7d89153182a75136b3fd799c2d5ddb000b7423ddc0fae102b284ab856e4b13c77197bc64d146262beaebe59fabd445fdbe813de610ae8a"
    let tag = "fb752843dc0381847d2977d64ba74c64f10bc2ad4acb9abf0da96cf03d647200"
    let expiration = DateTime.now().add(DAY).isoString()
    let userId = "8c41eb7a-922b-4f66-aa73-e6c9f255d8e7"

    let sessionManager = new SessionManagerPrisma(key, prismaClient)

    await prismaClient.session.create({
        data: {
            id,
            userId,
            expiration
        }
    })

    let session = await sessionManager.find(`${id}.${tag}`)
    if (session == null) throw new Error("session not found")

    expect(session.id).toBe(id)
    expect(session.tag).toBe(tag)
    expect(session.loggedUser.uuid).toBe(userId)
})