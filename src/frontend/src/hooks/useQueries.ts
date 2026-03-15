import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CategoryCount, CompanyProfile, UserProfile } from "../backend";
import { useActor } from "./useActor";

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfile"] });
      qc.invalidateQueries({ queryKey: ["categoryCounts"] });
    },
  });
}

export function useCompanyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<CompanyProfile | null>({
    queryKey: ["companyProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCompanyProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: CompanyProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCompanyProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["companySaved"] });
      qc.invalidateQueries({ queryKey: ["categoryCounts"] });
    },
  });
}

export function useCategoryCounts() {
  const { actor, isFetching } = useActor();
  return useQuery<CategoryCount[]>({
    queryKey: ["categoryCounts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategoryCounts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveBuyingIntent() {
  return useMutation({
    mutationFn: async (data: {
      category: string;
      subcategory: string;
      answers: Array<{ question: string; answer: string }>;
    }) => {
      const existing = JSON.parse(
        localStorage.getItem("buyingIntents") ?? "[]",
      );
      existing.push({ ...data, timestamp: Date.now() });
      localStorage.setItem("buyingIntents", JSON.stringify(existing));
    },
  });
}

export function useBuyingIntents() {
  return useQuery({
    queryKey: ["buyingIntents"],
    queryFn: async () => {
      return JSON.parse(localStorage.getItem("buyingIntents") ?? "[]");
    },
  });
}
