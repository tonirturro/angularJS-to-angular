import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ISelectableOption } from "../../../../common/rest";
import { ELanguages, IDialogParam, ILanguageParam } from "../../Components/definitions";

@Component({
    selector: "settings-dialog",
    styleUrls: [ "./settings-dialog.component.css" ],
    templateUrl: "./settings-dialog.component.html"
})

export class SettingsDialogComponent implements OnInit {
    @Input() public resolve: IDialogParam<ILanguageParam>;
    @Output() public dismiss = new EventEmitter<any>();
    @Output() public close = new EventEmitter<any>();

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

    public ngOnInit() {
        this.languageOption = this.resolve.params.language.toString();
    }

    public onDismiss() {
        this.dismiss.emit();
    }

    public onApply() {
        this.close.emit(Number.parseInt(this.languageOption, 10));
    }

    public get languageOptions(): ISelectableOption[] {
        return this.languageOptionsSupported;
    }
}
