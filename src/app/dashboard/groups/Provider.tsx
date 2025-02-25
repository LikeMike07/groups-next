'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface Group {
    id: number;
    name: string;
    path: string;
    imgUrl: string | null;
}

export interface GroupDetail extends Group {
    children: Group[];
}

interface Context {
    selectedGroup: Group | null;
    updateSelectedGroup: (group: Group | null) => void;
}

export const GroupPageContext = createContext<Context>({
    selectedGroup: null,
    updateSelectedGroup: () => undefined,
});

export default function GroupsPageProvider({ children }: { children: ReactNode }) {
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    useEffect(() => {
        console.log(selectedGroup);
    }, [selectedGroup]);

    function updateSelectedGroup(group: Group | null) {
        console.log(group);
        setSelectedGroup(group);
    }

    return <GroupPageContext.Provider value={{ selectedGroup, updateSelectedGroup }}>{children}</GroupPageContext.Provider>;
}

export const useGroupPageContext = () => {
    return useContext(GroupPageContext);
};
