import { procedure, router } from '../trpc';
import { authRouter } from './auth';
import { groupRouter } from './groups';
import { userRouter } from './user';
export const appRouter = router({
    hello: procedure.query(() => {
        return {
            greeting: `hello world`,
        };
    }),
    auth: authRouter,
    user: userRouter,
    group: groupRouter,
});
