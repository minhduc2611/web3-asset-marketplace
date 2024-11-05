export class FromA {
    getValues(){}
    validateValues(){}
}

export interface FlashCardStoreModel {
    isAdminOpen: boolean
    form?: FromA
}