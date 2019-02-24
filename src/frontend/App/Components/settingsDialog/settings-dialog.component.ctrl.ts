import { IComponentController } from "angular";
import { ISelectableOption } from "../../../../common/rest";
import { ELanguages, IDialogParam, ILanguageParam } from "../definitions";

export class SettingsDialogController implements IComponentController {
    // from/to bindings
    public resolve: IDialogParam<ILanguageParam>;
    public dismiss: () => void;
    public close: (result: any) => void;

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

    public $onInit() {
        this.languageOption = this.resolve.params.language.toString();
    }

    public apply() {
        this.close({ $value: Number.parseInt(this.languageOption, 10) });
    }

    public get languageOptions(): ISelectableOption[] {
        return this.languageOptionsSupported;
    }
}
