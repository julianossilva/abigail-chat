import { Password } from "../services/auth"
import { HashManagerImpl } from "./hash-manager"

test("hash and compare",async () => {
    let hashManager = new HashManagerImpl()

    let password = new Password("12345678")
    let hash = await hashManager.hash(password)

    expect(await hashManager.compare(password, hash)).toBe(true)
})

test("hash and compare wrong password",async () => {
    let hashManager = new HashManagerImpl()

    let password = new Password("12345678")
    let hash = await hashManager.hash(password)

    expect(await hashManager.compare(new Password("wrongpassword"), hash)).not.toBe(true)
})