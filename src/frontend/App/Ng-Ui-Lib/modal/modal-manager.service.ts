import { Injectable } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { take } from "rxjs/operators";
import { IModalSettings } from "./modal-config";
import { NgbModalRef } from "./modal-ref";
import { NgbModalService } from "./modal.service";

interface IDialogDictionary {
    [key: string]: IModalDescription;
}

export interface IModalDescription {
    content: any;
    settings: IModalSettings;
}

@Injectable({providedIn: "root"})
export class ModalManagerService {

    private readonly modalDescriptions: IDialogDictionary = {};
    private readonly modalStack: NgbModalRef[] = [];
    private readonly baseDialogSettings: IModalSettings = {
        backdrop: "static",
        keyboard: false,
        size: "sm"
    };

    constructor(private modalService: NgbModalService) {}

    /**
     * Registers the modal settings to be used when opening it
     * @param name The dialog name to be registered
     * @param settings the settings associated to this dialog
     */
    public register(name: string, description: IModalDescription): boolean {
        if (!this.modalDescriptions.hasOwnProperty(name)) {
            const extendedSettings = { ...this.baseDialogSettings, ...description.settings };
            this.modalDescriptions[name] =  {
                content: description.content,
                settings: extendedSettings
            };
            return true;
        }

        return false;
    }

    /**
     * Open a new dialog on the top of the current one
     * @param name the name of the dialog to be opened
     * @param params optional params to be submitted to the dialog
     */
    public push(name: string, params?: any): Observable<any> {
        const subject = new Subject<any>();
        if (this.modalDescriptions.hasOwnProperty(name)) {
            const descripion = this.modalDescriptions[name];
            const modalRef = this.modalService.open(descripion.content, descripion.settings);
            modalRef.componentInstance.params = params;
            this.modalStack.push(modalRef);
            modalRef.result.then((resultClose) => {
                this.modalStack.pop();
                subject.next(resultClose);
            }, (resultDismiss) => {
                this.modalStack.pop();
                subject.error(resultDismiss);
            });
            return subject.pipe(take(1));
        }

        return of(null);
    }

    /**
     * Closes the last opened dialog and removes it from the stack
     */
    public pop() {
        if (this.modalStack.length > 0) {
            const reference = this.modalStack[this.modalStack.length - 1];
            reference.close();
        }
    }

    /**
     * Closes the last opened dialog and open a new dialog at the same stack level
     * @param name the name of the dialog to be opened
     */
    public replaceTop(name: string, params?: any) {
        this.pop();
        this.push(name, params);
    }
}
