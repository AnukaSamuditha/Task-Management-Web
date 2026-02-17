import { UserState } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,

      setUser: (user) => set({ user }),

      logout: () =>
        set({
          user: null,
        }),
    }),
    {
      name: "user-store",
    },
  ),
);
