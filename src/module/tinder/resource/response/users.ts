import { MockUser } from "../modal/user";

export type UserListResponse = {
  users: MockUser[];
  total: number;
  limit: number;
  skip: number;
};
