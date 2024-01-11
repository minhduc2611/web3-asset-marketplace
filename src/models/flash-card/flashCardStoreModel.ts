import FlashCardViewer from "@/classes/FlashCardViewer";


export class FromA {
    getValues(){}
    validateValues(){}
}

export interface FlashCardStoreModel {
    flashCardViewer: FlashCardViewer
    isAdminOpen: boolean
    form?: FromA
}