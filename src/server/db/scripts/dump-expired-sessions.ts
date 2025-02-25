import { gt } from 'drizzle-orm';
import { db } from '..';
import { sessions } from '../schema';

db.delete(sessions).where(gt(sessions.expiresAt, new Date()));
