export interface UUIDGenerator {
    v4(): Promise<string>
}