import { MotiveApi } from "@/utils/api/MotiveApi";
import { useState } from "react";

// this is a test comment

export function useDeleteMotive() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteMotive = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await MotiveApi.deleteById(id);
      setIsLoading(false);
      return response;
    } catch {
      console.error("Erorr deleting motive:");
      setIsLoading(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  return { deleteMotive, isLoading, error };
}
