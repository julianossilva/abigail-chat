import { User, UserID } from "../model/user";

export interface UserRepository {
    create(user: User): Promise<void>
    find(userID: UserID): Promise<User|null>
}