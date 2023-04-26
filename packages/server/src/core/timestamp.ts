
import { DateTime } from 'luxon'

export class Time {
    private _time: luxon.DateTime

    constructor(isoString: string) {
        this._time = DateTime.fromISO(isoString)
    }

    isoString(): string {
        let isoString = this._time.toISO()

        if (isoString == null) throw new Error("invalid time")

        return isoString
    }
}