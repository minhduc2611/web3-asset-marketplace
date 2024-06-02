import { CollectionAddRequestModel } from "@/models/collection/collectionRequestModel";
import { CollectionGetAllResponseModel } from "@/models/collection/collectionResponseModel";
import superbaseInstance from "@/services/instances/superbaseInstance";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

const TABLE_NAME = "collections";

const getAll = async (): Promise<
  PostgrestSingleResponse<CollectionGetAllResponseModel>
> => {
  const response = await superbaseInstance
    .getInstance()
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });
  return response;
};

const insertOne = async ({ name, description, author_id }: CollectionAddRequestModel) =>
  await superbaseInstance
    .getInstance()
    .from(TABLE_NAME)
    .insert([{ name, description, author_id }])
    .select("*");

const CollectionService = {
  getAll,
  insertOne,
};
export default CollectionService;
