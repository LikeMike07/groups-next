'use client';
import { ReactNode, useState } from 'react';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { trpc } from './client';

export default function Provider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({}));
    const url = process.env.NEXT_PUBLIC_URL ? `https://${process.env.NEXT_PUBLIC_URL}/api/trpc` : 'http://localhost:4000/api/trpc';
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url,
                    fetch(url, options) {
                        return fetch(url, {
                            ...options,
                            credentials: 'include',
                        });
                    },
                }),
            ],
        })
    );
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools />
            </QueryClientProvider>
        </trpc.Provider>
    );
}
