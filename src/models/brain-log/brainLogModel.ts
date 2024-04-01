import { Tables } from "@/supabase/database.types";
import { Builder } from "builder-pattern";
import { randomUUID } from "crypto";

export type BrainLogTypeModel = Tables<"brain_log_types">;
export type BrainLogModel = Tables<"brain_logs">;

export const initBrainLogTypeModel = () =>
  Builder<BrainLogTypeModel>().id(randomUUID()).name('').build();
