'use server';

import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.SECRET_KEY || 'my-super-secret-secret-key';
const encryptionKey = new TextEncoder().encode(SECRET_KEY);

type SessionData = {
    sessionId: string;
    expiresAt: Date;
};

export async function encrypt(payload: SessionData) {
    try {
        const token = await new SignJWT({ ...payload })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime(payload.expiresAt)
            .setIssuedAt()
            .sign(encryptionKey);

        return token;
    } catch {
        throw new Error('Failed to encrypt session data');
    }
}

export async function decrypt(token: string | undefined): Promise<SessionData | null> {
    try {
        if (token) {
            const { payload } = await jwtVerify(token, encryptionKey);
            return payload as SessionData;
        }
        return null;
    } catch {
        throw new Error('Invalid session');
    }
}

export async function removeSessionFromCookies() {
    (await cookies()).delete('session');
    return;
}
