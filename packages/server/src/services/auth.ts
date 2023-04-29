import { Email, PasswordHash, User, UserID, Username } from "../model/user";
import { UserRepository } from "../repository/user-repository";
import { HashManager } from "./hash";
import { SessionManager } from "./session";
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

export class UserNotFoundError extends Error {
    constructor() {
        super("user not found error")
    }
}

export class WrongPasswordError extends Error {
    constructor() {
        super("wrong password error")
    }
}


export class AuthService {

    constructor(
        private uuidGenerator: UUIDGenerator,
        private hashManager: HashManager,
        private userRepository: UserRepository,
        private sessionManager: SessionManager
    ) { }

    async register(aUsername: string, anEmail: string, aPassword: string) {
        let uuid = await this.uuidGenerator.v4()
        let userID = new UserID(uuid)

        let username = new Username(aUsername)
        let email = new Email(anEmail)
        let password = new Password(aPassword);

        let hash = await this.hashManager.hash(password);

        let user = new User(
            userID,
            username,
            email,
            hash
        );

        await this.userRepository.create(user)
    }

    async authenticate(anUsername: string, aPassword: string): Promise<string> {
        let username = new Username(anUsername);
        let password = new Password(aPassword);

        let user = await this.userRepository.findByUsername(username)
        if (user == null) {
            throw new UserNotFoundError()
        }

        let hash = new PasswordHash(user.hash.hash)

        let passwordMatch = await this.hashManager.compare(password, hash)
        if (!passwordMatch) {
            throw new WrongPasswordError()
        }

        let session = await this.sessionManager.create({
            loggedUserID: user.id
        })

        return session.token
    }
}
