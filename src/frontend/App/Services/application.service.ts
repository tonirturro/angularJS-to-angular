import { Injectable } from "@angular/core";

@Injectable()
export class ApplicationService {
    public close() {
        window.close();
    }
}
