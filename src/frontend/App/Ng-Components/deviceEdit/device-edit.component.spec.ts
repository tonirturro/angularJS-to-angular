import { TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { IDevice } from "../../../../common/rest";
import { AppServicesModule } from "../../Services";
import { DataService } from "../../Services/data.service";
import { DeviceEditComponent } from "./device-edit.component.ng2";

describe("Given a device edit component", () => {
    const Devices: IDevice[] = [
        { id: 0, name: "Device 1" }
    ];
    let element: Element;
    let updateDeviceNameMock: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ DeviceEditComponent ],
            imports: [ FormsModule, AppServicesModule ]
         });

        const dataService = TestBed.get(DataService);
        spyOnProperty(dataService, "devices", "get").and.returnValue(Devices);
        updateDeviceNameMock = spyOn(dataService, "updateDeviceName");

        const fixture = TestBed.createComponent(DeviceEditComponent);
        const component = fixture.componentInstance;
        component.selectedDeviceId = Devices[0].id.toString();
        fixture.detectChanges();
        element = fixture.nativeElement;
    });

    it("When created Then it has the html defined", () => {
        expect(element.innerHTML).toBeDefined();
    });

    it("When clicking on the apply button it stored the edited name", () => {
        const button = element.querySelector("button");

        button.click();

        expect(updateDeviceNameMock).toHaveBeenCalledWith(Devices[0].id, Devices[0].name);
    });
});
