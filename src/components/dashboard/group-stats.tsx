'use client';

import { trpc } from '@/app/_trpc/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';

export default function GroupStats() {
    const userGroups = trpc.user.groups.useQuery();

    return (
        <Link href={'/dashboard/groups'}>
            <Card>
                <CardHeader>
                    <CardTitle>Groups</CardTitle>
                </CardHeader>
                <CardContent>{JSON.stringify(userGroups.data)}</CardContent>
            </Card>
        </Link>
    );
}
