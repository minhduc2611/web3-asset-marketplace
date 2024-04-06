import { BrainLogModel } from "@/models/brain-log/brainLogModel";
import { BrainLogStoreModel } from "@/models/brain-log/brainLogStoreModel";
import BrainLogService from "@/services/brainLog";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

export const BrainLogStore = atom<BrainLogStoreModel>({
  key: "brain-log",
  default: {
    brainLogTypes: [],
    subscribedData: {},
  },
});

// Store actions should be here in store file
export function useBrainLogStoreActions(author_id: string) {
  const set = useSetRecoilState(BrainLogStore);

  const subscribe = async (id: string) => {
    console.log("subscribing to", id);
    await BrainLogService.subscribe(id, {
      insert: localInsertOneBrainLog,
      update: localUpdateOneBrainLog,
      delete: localDeleteOneBrainLog,
    });
  };
  const localInsertOneBrainLog = async (data: BrainLogModel) => {
    set((old) => ({
      ...old,
      subscribedData: {
        ...old.subscribedData,
        [data.brain_log_type_id]: [
          data,
          ...old.subscribedData[data.brain_log_type_id],
        ],
      },
    }));
  };
  const localUpdateOneBrainLog = async (data: BrainLogModel) => {
    set((old) => ({
      ...old,
      subscribedData: {
        ...old.subscribedData,
        [data.brain_log_type_id]: old.subscribedData[
          data.brain_log_type_id
        ].map((item) => (item.id === data.id ? data : item)),
      },
    }));
  };

  const localDeleteOneBrainLog = async (id: string) => {
    await BrainLogService.delete(id);
  };

  const getBrainLogTypes = async (authorId:string, isSubscribe = true) => {
    const { data } = await BrainLogService.getAll(authorId);
    data &&
      set({
        brainLogTypes: data,
        subscribedData: data.reduce((acc, item) => {
          acc[item.id] = item.brain_logs;

          if (isSubscribe) {
            subscribe(item.id);
          }
          return acc;
        }, {} as BrainLogStoreModel["subscribedData"]),
      });
  };

  const insertBrainLog = async (data: BrainLogModel) => {
    // insert to db
  };

  return { getBrainLogTypes, insertBrainLog };
}

export const useBrainLogStoreValue = () => {
  return useRecoilValue(BrainLogStore);
};

export const useBrainLog = (author_id: string) => {
  return { ...useBrainLogStoreActions(author_id), ...useBrainLogStoreValue() };
};
