import { Batch, MockUser } from "../modal/user";

export type TinderStoreModal = {
  userStackMap: Record<string, Batch>;
  skip: number;
};
