import { initTRPC, TRPCError } from '@trpc/server';
import { validateSession } from './util/auth';
import { db } from './db';
import * as schema from '@/server/db/schema';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export interface Context {
    user?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    session?: {
        id: string;
    };
    isAuthed: boolean;
    req: Request;
    resHeaders: Headers;
    db: NodePgDatabase<typeof schema>;
}

export const createTRPCContext = async (opts: FetchCreateContextFnOptions): Promise<Context> => {
    const { req, resHeaders } = opts;
    return {
        req,
        resHeaders,
        isAuthed: false,
        db,
    };
};

const t = initTRPC.context<Context>().create();
export const router = t.router;
export const procedure = t.procedure;

export const authedProcedure = procedure.use(async (opts) => {
    const session = await validateSession(opts.ctx);

    if (!session) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return opts.next({
        ctx: {
            user: { id: session.userId },
            session: { id: session.id },
            isAuthed: true,
        },
    });
});
