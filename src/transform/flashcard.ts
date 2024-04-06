import {
  FlashCardAddRequestModel,
  FlashCardUpdateRequestModel,
} from "@/models/flash-card/flashCardRequestModel";
import { FlashCardRegisterFormState } from "@/stores/flashCardRegister";

/**
 * from FlashCardRegisterFormState
 * to FlashCardAddRequestModel
 */
const flashCardFormStateToAddRequestModel = (
  collectionId: number,
  state: FlashCardRegisterFormState
): FlashCardAddRequestModel => {
  return {
    definition: state.definition,
    collection_id: collectionId,
    media_url: state.media_url,
    term: state.term,
    author_id: state.author_id,
  } as FlashCardAddRequestModel;
};

/**
 * from FlashCardRegisterFormState
 * to FlashCardUpdateRequestModel
 */
const flashCardFormStateToUpdateRequestModel = (
  collectionId: number,
  state: FlashCardRegisterFormState
): FlashCardUpdateRequestModel => {
  if (!state.id) {
    throw new Error("Id required");
  }
  const request: FlashCardUpdateRequestModel = {
    id: state.id,
    definition: state.definition,
    collection_id: collectionId,
    media_url: state.media_url,
    term: state.term,
    author_id: state.author_id,
  };
  return request;
};

const FlashCardTransform = {
  flashCardFormStateToAddRequestModel,
  flashCardFormStateToUpdateRequestModel,
};
export default FlashCardTransform;
