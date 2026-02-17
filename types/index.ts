import { userSchema } from "@/schemas";
import z from "zod";

export type ChildProp = {
  children: React.ReactNode;
};

export type UserState = {
  user: z.infer<typeof userSchema> | null;

  hasHydrated: boolean;
  setUser: (user: z.infer<typeof userSchema>) => void;
  logout: () => void;
};
