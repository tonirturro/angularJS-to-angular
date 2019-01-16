import { Injectable } from "@angular/core";

/**
 * As silly as use the console to simulate a log service
 */
@Injectable()
export class LogService {
    public error(msg: string) {
        // tslint:disable-next-line:no-console
        console.error(msg);
    }
}
