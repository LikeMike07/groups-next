import { ReactNode } from 'react';
import GroupsPageProvider from './Provider';

export default function GroupsLayout(props: { children: ReactNode }) {
    return <GroupsPageProvider>{props.children}</GroupsPageProvider>;
}
