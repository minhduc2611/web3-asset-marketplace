import { CollectionAddRequestModel } from "@/models/collection/collectionRequestModel";
import { CollectionStoreModel } from "@/models/collection/collectionStoreModel";
import CollectionService from "@/services/collection";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

export const CollectionStore = atom<CollectionStoreModel>({
  key: "flash-card-collection",
  default: {
    collections: [],
  },
});

// Store actions should be here in store file
export function useCollectionStoreActions() {
  const setCollectionStore = useSetRecoilState(CollectionStore);

  const getCollections = async () => {
    const { data } = await CollectionService.getAll();
    data && setCollectionStore({ collections: data });
  };

  const addOneCollection = async (collection: CollectionAddRequestModel) => {
    await CollectionService.insertOne(collection);
    await getCollections();
  };

  // const setCustomers = async (customers: Customer) => {
  //     // code here
  // };

  return { getCollections,  addOneCollection };
}

export const useCollectionStoreValue = () => {
  return useRecoilValue(CollectionStore);
};
