"use client";

import { toast } from "sonner";
import { useState } from "react";
import type { BaseApiResponse } from "@/lib/types";
import { RealtimeProvider } from "@upstash/realtime/client";
import { QueryClient, QueryClientProvider, MutationCache } from "@tanstack/react-query";

const Providers = ({ children }: { children: React.ReactNode }) => {
    
  const [queryClient] = useState(
    () =>
      new QueryClient({

        mutationCache: new MutationCache({
          onSuccess: (data) => {
            const res = data as BaseApiResponse;

            if (
              res?.status_code >= 200 &&
              res?.status_code < 300 &&
              res?.message
            ) {
              toast.success(res.message);
            }
          },
          onError: (error) => {
            if (error instanceof Error) {
              toast.error(error.message);
            } else {
              toast.error("Something went wrong");
            }
          },
        }),

        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      })
  );

  return (
    <RealtimeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </RealtimeProvider>
  );
};

export default Providers;
