import { TinderStoreModal } from "@/module/tinder/resource/store/tinderStoreModal";
import { create } from "zustand";
import tinderService from "../service/users";
import { BATCH_SIZE, THREAD_HOLD } from "../constant/tinder";

interface Methods {
  getUsers: () => void;
  nextUser: () => void;
  initiatePage: () => void;
  flip: (id: string, like: boolean) => void;
}

export const useTinderStore = create<TinderStoreModal & Methods>((set, get) => {
  const getUsers = async () => {
    const { skip } = get();
    // get 6 users at a batch
    // if user swipe to third user of the batch, get next batch
    const res = await tinderService.getUsers(BATCH_SIZE, skip);
    

    set((state) => ({
      ...state,
      userStack: [...state.userStack, ...res.users],
      skip: skip + BATCH_SIZE,
    }));
    const { userStack } = get();
    console.log("new userStack", userStack);
  };
  const nextUser = async () => {
    const { userStack, seen } = get();
    set({
      userStack,
    });
    if (seen.size !== 0 && seen.size % THREAD_HOLD === 0) {
      getUsers();
    }
  };

  const initiatePage = async () => {
    await getUsers();
    nextUser();
  };

  const flip = (id: string, like: boolean) => {
    console.log(`User ${id} is ${like ? "liked" : "disliked"}`);
    const { seen } = get();
    seen.add(id);
    set({
      seen
    });
    nextUser();
  };

  return {
    skip: 0,
    total: 0,
    userStack: [],
    seen: new Set(),
    firstUser: {},
    secondUser: {},
    getUsers,
    nextUser,
    initiatePage,
    flip,
  };
});
