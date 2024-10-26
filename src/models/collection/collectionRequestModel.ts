import { CollectionModel } from "./collectionModel";

export type CollectionAddRequestModel = Omit<CollectionModel, 'id' | 'deleted_at' | 'created_at' | 'shared_author_ids'>