import { Tables } from "@/supabase/database.types";
import { Builder } from "builder-pattern";

export type FlashCardModel = Tables<'cards'> & {
  user_card_datas: Tables<'user_card_datas'>[];
};

export const initFlashCardModel = () =>
  Builder<FlashCardModel>()
    .id(0)
    .collection_id(null)
    .term(null)
    .definition(null)
    .deleted_at(null)
    .build();

    