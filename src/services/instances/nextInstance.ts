import ApiInstance from "./ApiInstance";

export const nextInstance = new ApiInstance(
  process.env.NEXT_PUBLIC_BASE_URL + "/api"
);
export default nextInstance;
