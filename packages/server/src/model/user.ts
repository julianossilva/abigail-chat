export class UserID {
    private _uuid: string

    constructor(uuid: string) {
        this._uuid = uuid;
    }

    get uuid(): string {
        return this._uuid
    }

    equal(other: UserID) {
        return this.uuid == other.uuid
    }
}

export class Username {
    private _username: string

    constructor(username: string) {
        this._username = username
    }

    get username(): string {
        return this._username
    }

    set username(value: string) {
        this._username = value
    }

    equal(other: Username): boolean {
        return this.username == this.username
    }
}

export class Email {
    private _email: string

    constructor(email: string) {
        this._email = email
    }

    get email(): string {
        return this._email
    }

    equal(other: Email): boolean {
        return this.email == other.email
    }
}

export class PasswordHash {
    private _hash: string

    constructor(hash: string) {
        this._hash = hash
    }

    get hash(): string {
        return this._hash
    }

    equal(other: PasswordHash): boolean {
        return this.hash == other.hash
    }
}

export class User {
    private _id: UserID;
    private _username: Username;
    private _email: Email;
    private _hash: PasswordHash;

    constructor(userID: UserID, username: Username, email: Email, hash: PasswordHash) {
        this._id = userID
        this._username = username
        this._email = email
        this._hash = hash
    }

    get id() {
        return this._id
    }

    set id(value: UserID) {
        this._id = value
    }

    get username(): Username {
        return this._username
    }

    set username(value: Username) {
        this._username = value
    }

    get email(): Email {
        return this._email
    }

    set email(value: Email) {
        this._email = value
    }

    get hash(): PasswordHash {
        return this._hash
    }

    set hash(value: PasswordHash) {
        this._hash = value
    }

    equal(other: User): boolean {
        return this.id.equal(other.id)
    }
}
