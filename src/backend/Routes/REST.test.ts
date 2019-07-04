// tslint:disable-next-line: no-var-requires
const chaiHttp = require("chai-http");
// tslint:disable-next-line: no-var-requires
const sinon = require("sinon");

import { expect, request, use } from "chai";

import { PageFields } from "../../common/model";
import { INewDeviceParams, IUpdateDeviceParams, IUpdateParams } from "../../common/rest";
import { main } from "../app";
import { Data } from "../Repository/Data";

describe("REST Route", () => {

    const ExpectedPageId = 1;
    const ExpectedDeviceId = 2;

    const checkRESTResponse = (field: string, done: () => void) => {
        request(main.application)
            .put(`/REST/pages/${field}`)
            .then((res) => {
                expect(res.status).to.equal(200);
                done();
            });
    };

    /**
     * Data driven test case to test uodates
     * @param dataFuntionToSpy is the function for the data layer that we want to mock
     * @param field is the REST update field to test
     * @param pageId is the page id to be updated
     * @param newValue is the new value to be update
     * @param done is the test completion callback for Mocha
     */
    const executeAndValidateUpdate = (
        dataFuntionToSpy: keyof Data,
        field: string,
        pageId: number,
        newValue: string,
        done: () => void) => {

        const spy = sinon.spy(main.dependencies.dataLayer, dataFuntionToSpy);

        const data: IUpdateParams = {
            newValue,
            pages: [pageId],
        };

        request(main.application)
            .put(`/REST/pages/${field}`)
            .set("content-type", "application/json")
            .send(JSON.stringify(data))
            .then(() => {
                expect(spy.calledOnce).to.equal(true);
                expect(spy.calledWith(pageId, newValue)).to.equal(true);
                done();
            });
    };

    /**
     * Initialize test environment
     */
    use(chaiHttp);
    const getCapabilitiesSpy = sinon.spy(main.dependencies.capabilitiesLayer, "getCapabilities");

    /**
     *
     * The test cases
     *
     */

    /************************************************************
     * Pages
     ************************************************************/
    it("Get pages responds ok", (done) => {
        request(main.application)
            .get("/REST/pages")
            .then((res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Get pages respond calls data", (done) => {
        const spy = sinon.spy(main.dependencies.dataLayer, "getPages");
        request(main.application)
            .get("/REST/pages")
            .then(() => {
                expect(spy.calledOnce).to.equal(true);
                done();
            });
    });

    it("Post pages responds ok", (done) => {
        request(main.application)
            .post(`/REST/pages/${ExpectedDeviceId}`)
            .then((res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Post pages calls new page", (done) => {
        const spy = sinon.spy(main.dependencies.dataLayer, "newPage");
        request(main.application)
            .post(`/REST/pages/${ExpectedDeviceId}`)
            .then(() => {
                expect(spy.calledOnce).to.equal(true);
                expect(spy.calledWith(ExpectedDeviceId)).to.equal(true);
                done();
            });
    });

    it("Delete page responds ok", (done) => {
        request(main.application)
            .del(`/REST/pages/${ExpectedPageId}`)
            .then((res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Delete page calls delete page with the right page number", (done) => {
        const spy = sinon.spy(main.dependencies.dataLayer, "deletePage");
        request(main.application)
            .del(`/REST/pages/${ExpectedPageId}`)
            .then(() => {
                expect(spy.calledOnce).to.equal(true);
                expect(spy.calledWith(ExpectedPageId)).to.equal(true);
                done();
            });
    });

    it("Update page size responds ok", (done) => {
        checkRESTResponse("pageSize", done);
    });

    it("Update page size calls update media size with the right parameters", (done) => {
        executeAndValidateUpdate("updatePageSize", "pageSize", 10, "0", done);
    });

    it("Update print quality responds ok", (done) => {
        checkRESTResponse("printQuality", done);
    });

    it("Update print quality calls update print quality with the right parameters", (done) => {
        executeAndValidateUpdate("updatePrintQuality", "printQuality", 15, "1", done);
    });

    it("Update media type responds ok", (done) => {
        checkRESTResponse("mediaType", done);
    });

    it("Update media type calls update media type with the right parameters", (done) => {
        executeAndValidateUpdate("updateMediaType", "mediaType", 5, "2", done);
    });

    it("Update destination responds ok", (done) => {
        checkRESTResponse("destination", done);
    });

    it("Update destination calls update destination with the right parameters", (done) => {
        executeAndValidateUpdate("updateDestination", "destination", 20, "0", done);
    });

    /**************************************************************************************
     * Devices
     **************************************************************************************/
    it("Get devices responds ok", (done) => {
        request(main.application)
            .get("/REST/devices")
            .then((res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Get devices respond calls data", (done) => {
        const spy = sinon.spy(main.dependencies.dataLayer, "getDevices");
        request(main.application)
            .get("/REST/devices")
            .then(() => {
                expect(spy.calledOnce).to.equal(true);
                done();
            });
    });

    it("Put devices responds ok", (done) => {
        request(main.application)
            .put("/REST/devices")
            .then((res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Put device with name calls new device with the name", (done) => {
        const spy = sinon.spy(main.dependencies.dataLayer, "newDevice");
        const data: INewDeviceParams = {
            name: "any"
        };
        request(main.application)
            .put("/REST/devices")
            .set("content-type", "application/json")
            .send(JSON.stringify(data))
            .then(() => {
                let r = expect(spy.calledOnce).to.equal(true);
                r = expect(spy.calledWith(data.name)).to.be.true;
                done();
            });
    });

    it("Delete device responds ok", (done) => {
        request(main.application)
            .del(`/REST/devices/${ExpectedDeviceId}`)
            .then((res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Delete device calls delete device with the right device number", (done) => {
        const spy = sinon.spy(main.dependencies.dataLayer, "deleteDevice");
        request(main.application)
            .del(`/REST/devices/${ExpectedDeviceId}`)
            .then(() => {
                let r = expect(spy.calledOnce).to.be.true;
                r = expect(spy.calledWith(ExpectedDeviceId)).to.be.true;
                done();
            });
    });

    it("Put device name responds ok", (done) => {
        const spy = sinon.spy(main.dependencies.dataLayer, "updateDeviceName");
        const data: IUpdateDeviceParams = {
            id: 0,
            newValue: "any"
        };

        request(main.application)
            .put(`/REST/devices/name`)
            .set("content-type", "application/json")
            .send(JSON.stringify(data))
            .then(() => {
            let r = expect(spy.calledOnce).to.be.true;
            r = expect(spy.calledWith(data.id, data.newValue)).to.be.true;
            done();
        });
    });

    it("Getting device options responds ok", (done) => {
        request(main.application)
            .get("/REST/deviceOptions/any")
            .then((res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Getting the page options calls the appropiated capabilities", (done) => {
        getCapabilitiesSpy.reset();
        request(main.application)
            .get(`/REST/deviceOptions/${PageFields.PageSize}`)
            .then(() => {
                expect(getCapabilitiesSpy.calledOnce).to.equal(true);
                expect(getCapabilitiesSpy.calledWith(PageFields.PageSize)).to.equal(true);
                done();
            });
    });

    it("Getting the qualities options calls the appropiated capabilities", (done) => {
        getCapabilitiesSpy.reset();
        request(main.application)
            .get(`/REST/deviceOptions/${PageFields.PrintQuality}`)
            .then(() => {
                expect(getCapabilitiesSpy.calledOnce).to.equal(true);
                expect(getCapabilitiesSpy.calledWith(PageFields.PrintQuality)).to.equal(true);
                done();
            });
    });

    it("Getting the media options calls the appropiated capabilities", (done) => {
        getCapabilitiesSpy.reset();
        request(main.application)
            .get(`/REST/deviceOptions/${PageFields.MediaType}`)
            .then(() => {
                expect(getCapabilitiesSpy.calledOnce).to.equal(true);
                expect(getCapabilitiesSpy.calledWith(PageFields.MediaType)).to.equal(true);
                done();
            });
    });

    it("Getting the destination options calls the appropiated capabilities", (done) => {
        getCapabilitiesSpy.reset();
        request(main.application)
            .get(`/REST/deviceOptions/${PageFields.Destination}`)
            .then(() => {
                expect(getCapabilitiesSpy.calledOnce).to.equal(true);
                expect(getCapabilitiesSpy.calledWith(PageFields.Destination)).to.equal(true);
                done();
            });
    });
});
