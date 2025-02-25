import { passwordSetupTokens, sessions, users } from '@/server/db/schema';
import { authedProcedure, procedure, router } from '@/server/trpc';
import { createSession, hashPassword, verifyPassword } from '@/server/util/auth';
import { TRPCError } from '@trpc/server';
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const authRouter = router({
    checkEmail: procedure.input(z.object({ email: z.string() })).mutation(async (opts) => {
        const { db } = opts.ctx;
        const user = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.email, opts.input.email) });

        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'No user found with that email',
            });
        }

        if (user.password !== null) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'User already has a password set',
            });
        }

        const token = randomBytes(32).toString('hex');

        await db.insert(passwordSetupTokens).values({
            token,
            user_id: user.id,
            expiresAt: new Date(Date.now() + 3600000), // 1 hr
        });

        return { token };
    }),

    setPassword: procedure
        .input(
            z.object({
                token: z.string(),
                password: z.string().min(8),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { db } = ctx;

            const tokenRecord = await db.query.passwordSetupTokens.findFirst({
                where: (passwordSetupTokens, { eq }) => eq(passwordSetupTokens.token, input.token),
            });

            if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Invalid or expired token',
                });
            }

            const hashedPassword = await hashPassword(input.password);

            // Using a transaction to ensure both operations succeed or fail together
            await db.transaction(async (tx) => {
                await tx
                    .update(users)
                    .set({
                        password: hashedPassword,
                    })
                    .where(eq(users.id, tokenRecord.user_id));

                await tx.delete(passwordSetupTokens).where(eq(passwordSetupTokens.id, tokenRecord.id));
            });

            return { success: true };
        }),

    login: procedure.input(z.object({ email: z.string(), password: z.string() })).mutation(async (opts) => {
        const { db } = opts.ctx;
        const user = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.email, opts.input.email) });

        if (!user) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'No user found with that email.',
            });
        }

        if (!user.password) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Password has not been set up. Please initialize First time setup.',
            });
        }

        const isValidPassword = verifyPassword(opts.input.password, user.password);

        if (!isValidPassword) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Invalid Login.',
            });
        }

        await createSession(user.id, opts.ctx);

        return { userId: user.id };
    }),

    logout: authedProcedure.mutation(async (opts) => {
        const { db, session } = opts.ctx;
        db.delete(sessions).where(eq(sessions.id, session.id));
        return { status: 'ok' };
    }),

    me: authedProcedure.query(async (opts) => {
        const { db } = opts.ctx;
        const user = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.id, opts.ctx.user.id) });
        return user;
    }),
});
