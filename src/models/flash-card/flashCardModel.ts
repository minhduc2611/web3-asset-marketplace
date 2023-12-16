import { Tables } from "@/supabase/database.types";
import { Builder } from "builder-pattern";

export type FlashCardModel = Tables<'cards'>;

export const initFlashCardModel = () =>
  Builder<FlashCardModel>()
    .id(0)
    .collection_id(null)
    .term(null)
    .definition(null)
    .deleted_at(null)
    .build();

    