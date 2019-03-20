import { Ng2StateDeclaration } from "@uirouter/angular";
import { Transition } from "@uirouter/angular";
import { DeviceEditComponent, PageGridComponent } from "../Components";

const deviceEditState: Ng2StateDeclaration = {
    component: DeviceEditComponent,
    name: "device",
    resolve: [{
        deps: [ Transition ],
        resolveFn: (transition: Transition) => transition.params().deviceId,
        token: "selectedDeviceId"
    }],
    url: "/device/:deviceId",
};

const pagesEditState: Ng2StateDeclaration = {
    component: PageGridComponent,
    name: "pages",
    resolve: [{
        deps: [ Transition ],
        resolveFn: (transition: Transition) => transition.params().deviceId,
        token: "selectedDeviceId"
    }],
    url: "/pages/:deviceId"
};

export const STATES: Ng2StateDeclaration[] = [ deviceEditState,  pagesEditState ];
