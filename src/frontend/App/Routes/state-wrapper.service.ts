import { Injectable } from "@angular/core";
import { StateService } from "@uirouter/angular";

@Injectable()
export class StateWrapperService {
    constructor(private stateService: StateService) {}

    public go(stateName: string, stateParams?: any) {
        this.stateService.go(stateName, stateParams);
    }
}
