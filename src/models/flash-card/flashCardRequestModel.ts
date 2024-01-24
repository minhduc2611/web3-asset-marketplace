import { FlashCardModel } from "./flashCardModel"

export type FlashCardRequestModel = {

}

export type FlashCardAddRequestModel = Omit<FlashCardModel, 'id' | 'deleted_at' | 'created_at'>
export type FlashCardUpdateRequestModel = Omit<FlashCardModel,  'deleted_at' | 'created_at'>
