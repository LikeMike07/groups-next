import { ReactNode } from 'react';

export default async function FirstTimeSetupLayout(props: { children: ReactNode }) {
    return (
        <div>
            <h2 className="font-mono text-lg">First time setup</h2>
            {props.children}
        </div>
    );
}
