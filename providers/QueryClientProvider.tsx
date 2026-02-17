"use client";
import { ChildProp } from "@/types";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export default function QueryClientProviderCom({ children }: ChildProp) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
