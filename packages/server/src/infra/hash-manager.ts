import { PasswordHash } from "../model/user";
import { Password } from "../services/auth";
import { HashManager } from "../services/hash";
import bcrypt from 'bcrypt'

export class HashManagerImpl implements HashManager {
    async hash(password: Password): Promise<PasswordHash> {
        let hashStr = await bcrypt.hash(password.password, 14)

        return new PasswordHash(hashStr)
    }
    async compare(password: Password, hash: PasswordHash): Promise<boolean> {
        return await bcrypt.compare(password.password, hash.hash)
    }
}