import { Tables } from "@/supabase/database.types";
import { Builder } from "builder-pattern";

export type CollectionModel = Tables<"collections">;

export const initFlashCardModel = () =>
  Builder<CollectionModel>().id(0).name(null).deleted_at(null).build();
