import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import {
  FlashCardAddRequestModel,
  FlashCardUpdateRequestModel,
} from "@/models/flash-card/flashCardRequestModel";
import { FlashCardRegisterFormState } from "@/stores/flashCardRegister";

/**
 * from FlashCardRegisterFormState
 * to FlashCardAddRequestModel
 */
export const flashCardFormStateToAddRequestModel = (
  collectionId: number,
  state: FlashCardRegisterFormState,
  audioUrl?: string
): FlashCardAddRequestModel => {
  return {
    definition: state.definition,
    collection_id: collectionId,
    media_url: state.media_url,
    audio_url: audioUrl,
    term: state.term,
    author_id: state.author_id,
  } as FlashCardAddRequestModel;
};

/**
 * from FlashCardRegisterFormState
 * to FlashCardUpdateRequestModel
 */
export const flashCardFormStateToUpdateRequestModel = (
  collectionId: number,
  state: FlashCardRegisterFormState,
  audioUrl?: string
): FlashCardUpdateRequestModel => {
  if (!state.id) {
    throw new Error("Id required");
  }
  const request: FlashCardUpdateRequestModel = {
    id: state.id,
    definition: state.definition,
    collection_id: collectionId,
    media_url: state.media_url,
    audio_url: audioUrl || null,
    term: state.term,
    author_id: state.author_id,
  };
  return request;
};

export const arrayToMap = (array: FlashCardModel[]) => {
  return array.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as { [key: number]: FlashCardModel });
}
