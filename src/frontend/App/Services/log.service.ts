import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

/**
 * As silly as use the console to simulate a log service
 */
@Injectable()
export class LogService {
    public error(msg: string) {
        if (!environment.test) {
            // tslint:disable-next-line:no-console
            console.error(msg);
        }
    }
    public info(msg: string): any {
        if (!environment.test) {
            // tslint:disable-next-line: no-console
            console.info(msg);
        }
    }
}
