'use client';
import { trpc } from '@/app/_trpc/client';
import { Skeleton } from '../ui/skeleton';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

export default function Greeting() {
    const user = trpc.auth.me.useQuery();

    if (user.isLoading) return <Skeleton className="h-8 w-40" />;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Hello, {user.data?.first_name}!</CardTitle>
                <CardDescription>Welcome to groups.</CardDescription>
            </CardHeader>
        </Card>
    );
}
