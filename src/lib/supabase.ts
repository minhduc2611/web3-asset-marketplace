import { AuthUser } from "@/types/auth";
import authService from "@/lib/auth-service";

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  // First check if we have a user in local storage
  const localUser = authService.getCurrentUser();
  if (localUser && authService.isAuthenticated()) {
    console.log("FE >>>>>>>>> user from local storage: ", localUser);
    return localUser;
  }

  // If no local user or not authenticated, try to verify with the backend
  const verifyResult = await authService.verifyToken();
  if (verifyResult.success && verifyResult.data) {
    // console.log("FE >>>>>>>>> user from backend verification: ", verifyResult.data);
    return verifyResult.data;
  }

  // console.log("FE >>>>>>>>> no authenticated user found");
  return null;
};

export const signOut = async () => {
  const result = await authService.logout();
  if (!result.success) {
    console.error("Error signing out:", result.error);
    throw new Error(result.message || 'Logout failed');
  }
};

// Export authService as the main auth interface
export { authService };
export default authService;