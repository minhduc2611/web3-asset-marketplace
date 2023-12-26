import { useState } from "react";

const useLoading = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const asyncLoad = async (promises: Promise<any>[]) => {
    setIsLoading(true);
    await Promise.all(promises);
    setIsLoading(false);
  };

  return { isLoading, asyncLoad };
};

export default useLoading;
