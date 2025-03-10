import { inferRouterOutputs } from '@trpc/server';
import { appRouter } from './routers/_app';

export { appRouter };

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<typeof appRouter>;
