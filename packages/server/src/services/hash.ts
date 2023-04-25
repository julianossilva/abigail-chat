import { PasswordHash } from "../model/user";
import { Password } from "./auth";

export interface HashManager {
    hash(password: Password): Promise<PasswordHash>
}