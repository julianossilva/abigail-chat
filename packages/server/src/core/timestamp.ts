
import { Duration, DateTime as LuxonDateTime } from 'luxon'

export const MS = 1;
export const SECOND = MS * 1000
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24

export class DateTime {
    private _time: LuxonDateTime

    constructor(isoString: string) {
        this._time = LuxonDateTime.fromISO(isoString)
    }

    isoString(): string {
        let isoString = this._time.toISO()

        if (isoString == null) throw new Error("invalid time")

        return isoString
    }

    static now(): DateTime {
        return new DateTime(new Date().toISOString())
    }

    add(ms: number): DateTime {
        let dur: Duration = Duration.fromMillis(ms)

        this._time.plus(dur)

        return this
    }
}