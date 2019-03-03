import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IDevice } from "../../../../common/rest";
import { DevicePanelComponent } from "./device-panel.component.ng2";

describe("Given a device panel component", () => {
    const InitialDevices: IDevice[] = [
        { id: 0, name: "Device 1" },
        { id: 1, name: "Device 2" },
        { id: 2, name: "Device 3" }
    ];

    let element: Element;
    let component: DevicePanelComponent;
    let fixture: ComponentFixture<DevicePanelComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({ declarations: [ DevicePanelComponent ]});
        fixture = TestBed.createComponent(DevicePanelComponent);
        component = fixture.componentInstance;
        component.devices = InitialDevices;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it("When created Then it has the html defined", () => {
        expect(element.innerHTML).toBeDefined();
    });

    it("When created Then it has the devices set by the model", () => {
        expect(element.querySelector("tbody").querySelectorAll("tr").length).toBe(InitialDevices.length);
    });

    it("When created Then it has not selected devices", () => {
        const devices = element.querySelector("tbody").querySelectorAll("tr");
        devices.forEach((device) => {
            expect(device.classList.contains("item-selected")).toBeFalsy();
        });
    });

    it("When a device is selected Then only this is showed as seleted", () => {
        const devicesRow = element.querySelector("tbody").querySelectorAll("tr");
        const devices: Element[] = [];
        devicesRow.forEach((row) => {
            devices.push(row.querySelector("td"));
        });
        const selectedItem = 0;
        component.selectedDeviceId = InitialDevices[selectedItem].id;
        fixture.detectChanges();

        for (let index = 0; index < devices.length; index++) {
            if (index === selectedItem) {
                expect(devices[index].classList.contains("item-selected")).toBeTruthy();
            } else {
                expect(devices[index].classList.contains("item-selected")).toBeFalsy();
            }
        }

    });

    it("When clicking on a device Then its selection is reported", () => {
        const selectedItem = 1;
        let reportedSelectedDeviceId: number;
        const device = element.querySelector("tbody").querySelectorAll("tr")[selectedItem].querySelector("td");
        component.onSelectedDevice.subscribe((id: number) => {
            reportedSelectedDeviceId = id;
        });

        device.click();

        expect(reportedSelectedDeviceId).toEqual(InitialDevices[selectedItem].id);
    });

    it("When clicking on a device delete button Then its deletion is reported", () => {
        const selectedItem = 0;
        let reportedDeletedDeviceId: number;
        const device = element.querySelector("tbody").querySelectorAll("tr")[selectedItem]
            .querySelector("td").querySelector("button");
        component.onDeleteDevice.subscribe((id: number) => {
            reportedDeletedDeviceId = id;
        });

        device.click();

        expect(reportedDeletedDeviceId).toEqual(InitialDevices[selectedItem].id);
    });
});
