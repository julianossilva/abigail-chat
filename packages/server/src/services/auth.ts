import { Email, PasswordHash, User, UserID, Username } from "../model/user";
import { UserRepository } from "../repository/user-repository";
import { HashManager } from "./hash";
import { UUIDGenerator } from "./uuid";

export class Password {
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
        private hashManager: HashManager,
        private userRepository: UserRepository
    ) { }

    async register(aUsername: string, anEmail: string, aPassword: string) {
        let uuid = await this.uuidGenerator.v4()
        let userID = new UserID(uuid)

        let username = new Username(aUsername)
        let email = new Email(anEmail)
        let password = new Password(aPassword);

        let hash = await this.hashManager.hash(password)

        let user = new User(
            userID,
            username,
            email,
            hash
        )

        await this.userRepository.create(user)
    }

    async authenticate(anUsername: string, aPassword: string) {
        let username = new Username(anUsername);
        let password = new Password(aPassword);


        let user = await this.userRepository.findByUsername(username)
        if (user == null) {
            return false
        }

        let hash = new PasswordHash(user.hash.hash)

        if (await this.hashManager.compare(password, hash)) {
            return true
        } else {
            return false;
        }
    }
}