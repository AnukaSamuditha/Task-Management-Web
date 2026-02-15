"use client";
import { ChildProp } from "@/types";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function QueryClientProviderCom({ children }: ChildProp) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
