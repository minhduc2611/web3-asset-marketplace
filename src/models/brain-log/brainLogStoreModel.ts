import { BrainLogTypesWithItems } from "@/services/brainLog";
import { BrainLogModel } from "./brainLogModel";

export interface BrainLogStoreModel {
  brainLogTypes: BrainLogTypesWithItems;
  subscribedData: Record<string, BrainLogModel[] | []>;
}
