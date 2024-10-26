import {
  UserCardDataAddRequestModel,
  UserCardDataUpdateRequestModel,
} from "@/models/user-card-data/flashCardRequestModel";
import superbaseInstance from "@/services/instances/superbaseInstance";
// import { decode } from 'base64-arraybuffer'

const USER_CARD_TABLE = "user_card_datas";

const insertOne = async (a: UserCardDataAddRequestModel) =>
  await superbaseInstance
    .getInstance()
    .from(USER_CARD_TABLE)
    .insert([a])
    .select("*");

const updateOne = async (a: UserCardDataUpdateRequestModel) =>
  await superbaseInstance
    .getInstance()
    .from(USER_CARD_TABLE)
    .update(a)
    .eq("id", a.id || 0)
    .select();

const upsertOne = async (a: UserCardDataUpdateRequestModel) =>
  await superbaseInstance
    .getInstance()
    .from(USER_CARD_TABLE)
    .upsert(a)
    .select();

const deleteOne = async (id: number) =>
  await superbaseInstance
    .getInstance()
    .from(USER_CARD_TABLE)
    .delete()
    .eq("id", id);
const UserCardDataService = {
  insertOne,
  updateOne,
  deleteOne,
  upsertOne,
};
export default UserCardDataService;
