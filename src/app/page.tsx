import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="">
            <h1 className={`text-3xl font-mono`}>Groups</h1>
            <Link href={'/login'}>
                <Button className="mt-4">Login</Button>
            </Link>
        </div>
    );
}
