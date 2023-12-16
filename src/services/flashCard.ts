import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import { FlashCardAddRequestModel } from "@/models/flash-card/flashCardRequestModel";
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

const insertOne = async ({
  term,
  definition,
  collection_id,
}: FlashCardAddRequestModel) =>
  await superbaseInstance
    .getInstance()
    .from(FLASK_CARD_TABLE)
    .insert([{ term, definition, collection_id: collection_id }])
    .select("*");

const updateOne = async ({ id, term, definition }: Partial<FlashCardModel>) =>
  await superbaseInstance
    .getInstance()
    .from(FLASK_CARD_TABLE)
    .update({ term, definition })
    .eq("id", id || 0)
    .select();

const upload = (path: string, file: File) =>
  superbaseInstance
    .getInstance()
    .storage.from(FLASK_CARD_BUCKET)
    .upload("public/avatar1.png", file, {
      cacheControl: "3600",
      upsert: false,
    });

const FlashCardService = {
  getAll,
  insertOne,
};
export default FlashCardService;
