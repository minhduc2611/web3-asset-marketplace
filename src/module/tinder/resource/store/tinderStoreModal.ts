import { MockUser } from "../modal/user";


export type TinderStoreModal = {
    userStack: MockUser[];
    skip: number;
    seen: Set<string>;
};