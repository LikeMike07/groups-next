import { ReactNode } from 'react';

export default function GroupLayout(props: { children: ReactNode }) {
    return <div className=" w-full mx-auto">{props.children}</div>;
}
