import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";

interface UserStore {
  user: User | null;
  getUser: () => User | null;
  setUser: (user: User) => void;
  updateUserCredits: (credits: number) => void;
}

export const useProfileStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      getUser: () => get().user,
      setUser: (user) => set({ user }),
      updateUserCredits: (credits) =>
        set((state) => {
          const user = state.user;
          if (user) {
            return {
              user: {
                ...user,
                credits,
                name: user.name || "",
                email: user.email || "",
              },
            };
          }
          return state;
        }),
    }),
    { name: "profile" },
  ),
);
