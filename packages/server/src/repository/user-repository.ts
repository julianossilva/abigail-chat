import { User, UserID, Username } from "../model/user";

export class IDAlreadInUse extends Error {
    constructor(){
        super("user id already in use")
    }
}

export class UsernameAlreadyInUse extends Error {
    constructor(){
        super("username already in use")
    }
}

export class EmailAlreadyInUse extends Error {
    constructor() {
        super("email already in use")
    }
}

export interface UserRepository {
    create(user: User): Promise<void>
    find(userID: UserID): Promise<User|null>
    findByUsername(username: Username): Promise<User|null>
}

export class UserRepositoryInMemory implements UserRepository{
    private _users: User[]
    
    constructor() {
        this._users = []
    }

    async create(user: User): Promise<void> {
        this._users.push(user)
    }
    
    async find(userID: UserID): Promise<User | null> {
        let user = this._users.find((u)=>{
            return u.id.equal(userID)
        })

        return user || null
    }

    async findByUsername(username: Username): Promise<User | null> {
        let user = this._users.find((u)=>{
            return u.username.equal(username)
        })

        return user || null
    }
}