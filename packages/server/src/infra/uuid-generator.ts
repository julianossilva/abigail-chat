import { UUIDGenerator } from "../services/uuid";
import { v4 } from 'uuid';


export class UUIDGeneratorImpl implements UUIDGenerator{
    async v4(): Promise<string> {
        return v4()
    }
}