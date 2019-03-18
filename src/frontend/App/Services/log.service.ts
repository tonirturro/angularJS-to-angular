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
    public info(msg: string): any {
        // tslint:disable-next-line: no-console
        console.info(msg);
    }
}
