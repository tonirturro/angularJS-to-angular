import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { PageFields } from "../../../../common/model";
import { ISelectableOption } from "../../../../common/rest";
import { DataService } from "../../Services/data.service";
import { LocalizationService } from "../localization.service";

@Component({
    selector: "page-grid",
    templateUrl: "./page-grid.component.html"
})

export class PageGridComponent implements OnInit {

    /**
     * Internal properties
     */
    private selectedPages: number[] = [];
    private localizedPrintQualityCapabilities: ISelectableOption[] = [];
    private localizedMediaTypeCapabilities: ISelectableOption[] = [];
    private localizedDestinationCapabilities: ISelectableOption[] = [];
    private localizationSubscription: Subscription;

    constructor(
        private dataService: DataService,
        private localizationService: LocalizationService
    ) {}

    public ngOnInit() {
        this.loadLocalizedCapabilities();
    }

    /**
     * Gets the capabilites that need to be translated and translates them
     */
    private loadLocalizedCapabilities() {
        this.localizedPrintQualityCapabilities = [];
        this.dataService
            .getCapabilities(PageFields.PrintQuality)
            .map((capability) => this.localizationService.getLocalizedCapability(capability)
                .subscribe((result) => this.localizedPrintQualityCapabilities.push(result)));
        this.localizedMediaTypeCapabilities = [];
        this.dataService
            .getCapabilities(PageFields.MediaType)
            .map((capability) => this.localizationService.getLocalizedCapability(capability)
                .subscribe((result) => this.localizedMediaTypeCapabilities.push(result)));
        this.localizedDestinationCapabilities = [];
        this.dataService
            .getCapabilities(PageFields.Destination)
            .map((capability) => this.localizationService.getLocalizedCapability(capability)
                .subscribe((result) => this.localizedDestinationCapabilities.push(result)));
    }
}
