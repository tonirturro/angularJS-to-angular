
import { PageFields } from "../../common/model";
import { Capabilities } from "./Capabilities";

import { expect } from "chai";

describe("Given a capabilities service", () => {
    let capabilities: Capabilities;

    beforeEach(() => {
        capabilities = new Capabilities();
    });

    it("When getting page size capabilities then they are defined", () => {
        expect(capabilities.getCapabilities(PageFields.PageSize)).to.not.equal(undefined);
    });

    it("When getting page size capabilities then they get as many as supported pages", () => {
        expect(capabilities.getCapabilities(PageFields.PageSize).length)
            .to.equal(Capabilities.PageOptions.length);
    });

    it("When getting page size capabilities then the labels match the supported pages", () => {
        const pageOptions = capabilities.getCapabilities(PageFields.PageSize);
        pageOptions.forEach((option) => {
            expect(Capabilities.PageOptions.indexOf(option.label)).to.be.greaterThan(-1);
        });
    });

    it("When getting print qualities capabilities then they are defined", () => {
        expect(capabilities.getCapabilities(PageFields.PrintQuality)).to.not.equal(undefined);
    });

    it("When getting print qualities capabilities then they get as many as supported qualities", () => {
        expect(capabilities.getCapabilities(PageFields.PrintQuality).length)
            .to.equal(Capabilities.PrintQualities.length);
    });

    it("When getting print qualities capabilities then the labels match the supported qualities", () => {
        const qualityOptions = capabilities.getCapabilities(PageFields.PrintQuality);
        qualityOptions.forEach((option) => {
            expect(Capabilities.PrintQualities.indexOf(option.label)).to.be.greaterThan(-1);
        });
    });

    it("When getting media type capabilities then they are defined", () => {
        expect(capabilities.getCapabilities(PageFields.MediaType)).to.not.equal(undefined);
    });

    it("When getting media type capabilities then they get as many as supported media", () => {
        expect(capabilities.getCapabilities(PageFields.MediaType).length)
            .to.equal(Capabilities.MediaTypes.length);
    });

    it("When getting media type capabilities then the labels match the supported media", () => {
        const mediaOptions = capabilities.getCapabilities(PageFields.MediaType);
        mediaOptions.forEach((option) => {
            expect(Capabilities.MediaTypes.indexOf(option.label)).to.be.greaterThan(-1);
        });
    });

    it("When getting destination capabilities then they are defined", () => {
        expect(capabilities.getCapabilities(PageFields.Destination)).to.not.equal(undefined);
    });

    it("When getting destination capabilities then they get as many as supported destinations", () => {
        expect(capabilities.getCapabilities(PageFields.Destination).length)
            .to.equal(Capabilities.Destinations.length);
    });

    it("When getting destination capabilities then the labels match the supported destinations", () => {
        const destinationOptions = capabilities.getCapabilities(PageFields.Destination);
        destinationOptions.forEach((option) => {
            expect(Capabilities.Destinations.indexOf(option.label)).to.be.greaterThan(-1);
        });
    });
});
