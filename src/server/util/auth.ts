import { compare, hash } from 'bcryptjs';
import { sessions } from '../db/schema';
import { decrypt, encrypt } from '@/lib/sessions';
import { cookies } from 'next/headers';
import { Context } from '../trpc';

export async function createSession(userId: number, ctx: Context) {
    const { db } = ctx;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const data = await db
        .insert(sessions)
        .values({
            userId,
            expiresAt,
            sessionData: {},
        })
        .returning({ id: sessions.id });

    const sessionId = data[0].id;

    const session = await encrypt({ sessionId, expiresAt });

    (await cookies()).set('session', session, {
        httpOnly: true,
        secure: false,
        expires: expiresAt,
    });

    // setCookie(ctx.resHeaders, 'session', session, {
    //     httpOnly: true,
    //     secure: false,
    //     expires: expiresAt,
    // });

    return session;
}

export async function validateSession(ctx: Context) {
    const { db } = ctx;
    const sessionCookie = (await cookies()).get('session');

    // console.log(sessionCookie);

    if (!sessionCookie?.value) {
        throw new Error('No session found');
    }

    try {
        const sessionData = await decrypt(sessionCookie.value);

        if (!sessionData) {
            throw new Error('No session found');
        }

        const session = await db.query.sessions.findFirst({
            where: (sessions, { eq }) => eq(sessions.id, sessionData.sessionId),
        });

        if (!session || session.expiresAt < new Date()) {
            throw new Error('Session expired');
        }

        return session;
    } catch {
        throw new Error('Invalid session');
    }
}

export async function hashPassword(password: string) {
    return await hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword);
}
