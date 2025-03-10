'use client';
import { trpc } from '@/app/_trpc/client';
import GroupChildren from './structure/group-children';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GroupMembers from './members/group-members';
import GroupRoles from './roles/group-roles';
import GroupHeader from './header/group-header';

export default function Group(props: { groupId: number }) {
    const group = trpc.group.getGroup.useQuery({ groupId: Number(props.groupId) });

    if (group.isLoading) return <>Loading...</>;

    if (!group.data) throw new Error('group not found');

    return (
        <div>
            <GroupHeader group={group.data} />
            <div className="grid grid-cols-4 divide-x border-t">
                <div className="col-span-3 p-4">
                    <Tabs defaultValue="members">
                        <TabsList className="grid grid-cols-2 gap-2">
                            <TabsTrigger value="members">Members</TabsTrigger>
                            <TabsTrigger value="roles">Roles</TabsTrigger>
                        </TabsList>
                        <TabsContent value="members">
                            <GroupMembers groupId={group.data.id} />
                        </TabsContent>
                        <TabsContent value="roles">
                            <GroupRoles groupId={group.data.id} />
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="p-4">
                    <GroupChildren group={group.data} />
                </div>
            </div>
        </div>
    );
}
