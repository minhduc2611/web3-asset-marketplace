import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import { FlashCardAddRequestModel, FlashCardUpdateRequestModel } from "@/models/flash-card/flashCardRequestModel";
import { FlashCardGetAllResponseModel } from "@/models/flash-card/flashCardResponseModel";
import superbaseInstance from "@/services/superbaseInstance";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

const FLASK_CARD_BUCKET = "flashcard";
const FLASK_CARD_TABLE = "cards";

const getAll = async (
  collectionId: number
): Promise<PostgrestSingleResponse<FlashCardGetAllResponseModel>> => {
  const response = await superbaseInstance
    .getInstance()
    .from("cards")
    .select("*")
    .eq("collection_id", collectionId)
    .order("created_at", { ascending: false });
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
    .upload(path || "public/avatar1.png", file);

const FlashCardService = {
  getAll,
  insertOne,
  updateOne,
  upload
};
export default FlashCardService;
