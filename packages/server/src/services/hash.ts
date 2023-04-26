import { PasswordHash } from "../model/user";
import { Password } from "./auth";

export interface HashManager {
    hash(password: Password): Promise<PasswordHash>
    compare(password: Password, hash: PasswordHash): Promise<boolean>
}