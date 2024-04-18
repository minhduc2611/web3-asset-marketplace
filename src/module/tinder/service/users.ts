import mockInstance from "@/services/instances/mockInstance";
import { MockUser } from "../resource/modal/user";
import { UserListResponse } from "../resource/response/users";

class TinderService {
  private path = "/users";
  private apiInstance = mockInstance;
  getUsers = async (limit: number = 6, skip: number) => {
    const response = await this.apiInstance.get<UserListResponse>(
      this.path + `?limit=${limit}&skip=${skip}`
    );
    return response;
  };
}
const tinderService = new TinderService();
export default tinderService;
