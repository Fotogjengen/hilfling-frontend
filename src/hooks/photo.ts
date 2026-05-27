import { PhotoApi } from "@/utils/api/PhotoApi";
import { useQuery } from "@tanstack/react-query";

export const usePhotosByMotiveId = (motiveId: string) => {
  return useQuery({
    queryKey: ["photos", "motive", motiveId],
    queryFn: () => PhotoApi.getAllByMotiveId(motiveId),
    enabled: !!motiveId,
  });
};
