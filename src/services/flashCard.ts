import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import {
  FlashCardAddRequestModel,
  FlashCardUpdateRequestModel,
} from "@/models/flash-card/flashCardRequestModel";
import { FlashCardGetAllResponseModel } from "@/models/flash-card/flashCardResponseModel";
import superbaseInstance from "@/services/instances/superbaseInstance";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
// import { decode } from 'base64-arraybuffer'

export const FLASK_CARD_BUCKET = "flashcard";
const FLASK_CARD_TABLE = "cards";

const getAll = async (
  collectionId: number
): Promise<PostgrestSingleResponse<FlashCardGetAllResponseModel>> => {
  const response = await superbaseInstance
    .getInstance()
    .from("cards")
    .select("*")
    .eq("collection_id", collectionId)
    .order("next_review_time", { ascending: false });
  // .range(0, 20);
  return response;
};

const insertOne = async (a: FlashCardAddRequestModel) =>
  await superbaseInstance
    .getInstance()
    .from(FLASK_CARD_TABLE)
    .insert([a])
    .select("*");

const updateOne = async (a: FlashCardUpdateRequestModel) =>
  await superbaseInstance
    .getInstance()
    .from(FLASK_CARD_TABLE)
    .update(a)
    .eq("id", a.id || 0)
    .select();

const upload = (path: string, file: File) =>
  superbaseInstance
    .getInstance()
    .storage.from(FLASK_CARD_BUCKET)
    .upload(path || "public/avatar1.png", file, {
    contentType: 'audio/mpeg'
  });

    // .upload('email'+ "/" + "audio.mp3", decode('mp3_file'), {
    //   contentType: 'audio/mpeg'
    // }

const deleteOne = async (id: number) =>
  await superbaseInstance
    .getInstance()
    .from(FLASK_CARD_TABLE)
    .delete()
    .eq("id", id);
const FlashCardService = {
  getAll,
  insertOne,
  updateOne,
  upload,
  deleteOne,
};
export default FlashCardService;
