import { Tables } from "@/supabase/database.types";
import { Builder } from "builder-pattern";
import { v4 } from "uuid";

export type UserCardDataModel = Tables<"user_card_datas">;
export const initUserCardDataModel = (user_id: string, card_id: number) =>
  Builder<UserCardDataModel>()
    .id(v4())
    .interval(0)
    .next_review_time(null)
    .user_id(user_id)
    .card_id(card_id)
    .build();
