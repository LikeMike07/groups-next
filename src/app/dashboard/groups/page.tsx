'use client';
import { trpc } from '@/app/_trpc/client';
import { createEdgesFromPaths } from '@/lib/utils';
import { Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import GroupsFlow from '@/components/dashboard/groups/flow';
import { ReactFlowProvider } from '@xyflow/react';
import { useContext } from 'react';
import { GroupPageContext } from './Provider';
import { Button } from '@/components/ui/button';
import { ArrowRightFromLine } from 'lucide-react';
import { GroupSidebar, GroupSidebarContent } from '@/components/dashboard/groups/group-sidebar';
import GroupDetail from '@/components/dashboard/groups/group/group-detail';

export default function GroupsPage() {
    const groups = trpc.user.groups.useQuery();

    const { selectedGroup, updateSelectedGroup } = useContext(GroupPageContext);

    if (groups.isLoading) return <div>loading...</div>;

    if (!groups.data) throw new Error('Error fetching groups');

    const nodes: Node[] = groups.data.map((group, i) => {
        return {
            id: group.id.toString(),
            type: 'groupNode',
            position: { x: 0, y: 100 * i },
            data: { ...group },
        };
    });

    const edges = createEdgesFromPaths(groups.data);

    return (
        <div className="h-full w-full">
            <div
                className=" border-y flex relative overflow-clip"
                style={{
                    height: `${100 - 15}vh`,
                }}
            >
                <ReactFlowProvider>
                    <GroupsFlow nodes={nodes} edges={edges} />
                </ReactFlowProvider>
                <GroupSidebar open={!!selectedGroup}>
                    <GroupSidebarContent>
                        <Button className="absolute right-4 top-4" size={'icon'} onClick={() => updateSelectedGroup(null)}>
                            <ArrowRightFromLine />
                        </Button>
                        {selectedGroup && <GroupDetail group={selectedGroup} />}
                    </GroupSidebarContent>
                </GroupSidebar>
            </div>
        </div>
    );
}
