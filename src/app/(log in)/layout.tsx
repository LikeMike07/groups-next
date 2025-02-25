import { ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
    return <div className="md:border max-w-sm p-4 rounded mx-auto text-sm m-10">{children}</div>;
}
