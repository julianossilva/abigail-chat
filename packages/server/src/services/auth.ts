import { Email, User, UserID, Username } from "../model/user";
import { UserRepository } from "../repository/user-repository";
import { HashManager } from "./hash";
import { UUIDGenerator } from "./uuid";

export class Password{
    private _password: string

    constructor(password: string) {
        this._password = password
    }

    get password(): string {
        return this._password
    }

    equal(other: Password): boolean {
        return this.password == other.password
    }
}

export class AuthService {

    constructor(
        private uuidGenerator: UUIDGenerator,
        private hashGenerator: HashManager,
        private userRepository: UserRepository
    ) {}

    async register(aUsername: string, anEmail: string, aPassword: string) {
        let uuid = await this.uuidGenerator.v4()
        let userID = new UserID(uuid)

        let username = new Username(aUsername)
        let email = new Email(anEmail)
        let password = new Password(aPassword);

        let hash = await this.hashGenerator.hash(password)

        let user = new User(
            userID,
            username,
            email,
            hash
        )

        await this.userRepository.create(user)
    }
}