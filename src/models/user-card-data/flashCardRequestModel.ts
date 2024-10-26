import { UserCardDataModel } from "./userCardDataModel";

export type UserCardDataAddRequestModel = Omit<
  UserCardDataModel,
  "id" | "created_at"
>;
export type UserCardDataUpdateRequestModel = Omit<
  UserCardDataModel,
  "created_at" | "user_id" | "card_id"
>;
