import { TinderStoreModal } from "@/module/tinder/resource/store/tinderStoreModal";
import { v4 } from "uuid";
import { create } from "zustand";
import { BATCH_SIZE, THREAD_HOLD } from "../constant/tinder";
import tinderService from "../service/users";
interface Methods {
  getUsers: () => void;
  initiatePage: () => void;
  flip: (params: { userId: string; like: boolean; batchId: string }) => void;
}

export const useTinderStore = create<TinderStoreModal & Methods>((set, get) => {
  const getUsers = async () => {
    const { skip } = get();
    // get BATCH_SIZE users in a batch
    // if user swipe to user number THREAD_HOLD of the batch, get next batch
    const res = await tinderService.getUsers(BATCH_SIZE, skip);
    const batchId = v4();
    set((state) => ({
      ...state,
      userStackMap: {
        [batchId]: {
          users: res.users,
          id: batchId,
          seen: new Set(),
        },
        ...state.userStackMap,
      },
      skip: skip + BATCH_SIZE,
    }));
  };

  const initiatePage = async () => {
    await getUsers();
  };

  const swipe = (params: {
    userId: string;
    like: boolean;
    batchId: string;
  }) => {
    const { userId, like, batchId } = params;
    console.log(
      `swipeDEBUG: batch [${batchId}], User ${userId} is ${
        like ? "liked" : "disliked"
      }`
    );
    const { userStackMap } = get();
    const userStack = userStackMap[batchId];
    userStackMap[batchId].seen.add(userId);
    set({ userStackMap });

    if (userStack.seen.size == THREAD_HOLD) {
      console.log(
        "swipeDEBUG: thread hold is reached: " + [batchId],
        ". Calling another batch"
      );
      getUsers();
    }
    if (userStack.seen.size === userStack.users.length) {
      console.log(`swipeDEBUG: All users are seen in this batch: [${batchId}]`);
      setTimeout(() => {
        delete userStackMap[batchId];
        set({ userStackMap });
      }, 1000);
    }
    const { userStackMap: debug } = get();
    console.log("swipeDEBUG: userStackMap", debug);
  };

  return {
    skip: 0,
    total: 0,
    userStackMap: {},
    firstUser: {},
    secondUser: {},
    getUsers,
    initiatePage,
    flip: swipe,
  };
});
