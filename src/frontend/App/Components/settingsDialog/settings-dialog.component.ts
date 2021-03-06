import { Component, Input, OnInit } from "@angular/core";
import { ISelectableOption } from "../../../../common/rest";
import { NgbActiveModal } from "../../UiLib";
import { ELanguages, ILanguageParam } from "../definitions";

@Component({
    selector: "settings-dialog",
    styleUrls: [ "./settings-dialog.component.scss" ],
    templateUrl: "./settings-dialog.component.html"
})

export class SettingsDialogComponent implements OnInit {
    @Input() public params: ILanguageParam;

    public languageOption: string;

    private readonly languageOptionsSupported: ISelectableOption[] =  [
        {
            label: "STR_English",
            value: ELanguages.English.toString()
        },
        {
            label: "STR_Klingon",
            value: ELanguages.Klingon.toString()
        },
    ];

    constructor(private activeModal: NgbActiveModal) {}

    public ngOnInit() {
        this.languageOption = this.params.language.toString();
    }

    public onDismiss() {
        this.activeModal.dismiss();
    }

    public onApply() {
        this.activeModal.close(Number.parseInt(this.languageOption, 10));
    }

    public get languageOptions(): ISelectableOption[] {
        return this.languageOptionsSupported;
    }
}
