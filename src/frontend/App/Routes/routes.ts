import { Ng2StateDeclaration } from "@uirouter/angular";
import { Transition } from "@uirouter/angular";
import { DeviceEditComponent } from "../Components/deviceEdit/device-edit.component";
import { PageGridComponent } from "../Components/pageGrid/page-grid.component";

export function getDeviceId(transition: Transition) {
    return transition.params().deviceId;
}

const deviceEditState: Ng2StateDeclaration = {
    component: DeviceEditComponent,
    name: "device",
    resolve: [{
        deps: [ Transition ],
        resolveFn: getDeviceId,
        token: "selectedDeviceId"
    }],
    url: "/device/:deviceId",
};

const pagesEditState: Ng2StateDeclaration = {
    component: PageGridComponent,
    name: "pages",
    resolve: [{
        deps: [ Transition ],
        resolveFn: getDeviceId,
        token: "selectedDeviceId"
    }],
    url: "/pages/:deviceId"
};

export const STATES: Ng2StateDeclaration[] = [ deviceEditState,  pagesEditState ];
