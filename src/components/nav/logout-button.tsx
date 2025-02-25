'use client';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import { removeSessionFromCookies } from '@/lib/sessions';

export default function LogoutButton() {
    const router = useRouter();

    const logoutMutation = trpc.auth.logout.useMutation({
        onSuccess: async () => {
            await removeSessionFromCookies();
            router.push('/login');
        },
    });

    function logout() {
        logoutMutation.mutate();
    }

    return (
        <Button className="flex justify-between" onClick={logout}>
            Logout <LogOut />
        </Button>
    );
}
