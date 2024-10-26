export const getAuthenticatedUserId = () => {
  const state = localStorage.getItem("authentication-storage");
    if (!state) {
        return null;
    }
    return JSON.parse(state)?.state?.user?.id
}