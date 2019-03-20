import { Injectable } from "@angular/core";

declare var TEST: boolean;

/**
 * As silly as use the console to simulate a log service
 */
@Injectable()
export class LogService {
    public error(msg: string) {
        if (!TEST) {
            // tslint:disable-next-line:no-console
            console.error(msg);
        }
    }
    public info(msg: string): any {
        if (!TEST) {
            // tslint:disable-next-line: no-console
            console.info(msg);
        }
    }
}
