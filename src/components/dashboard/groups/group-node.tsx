'use client';
import { Group } from '@/app/dashboard/groups/Provider';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Handle, Position } from '@xyflow/react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
    data: Group;
}
export default function GroupNode({ data }: Props) {
    const router = useRouter();

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div className="p-3 bg-background border rounded">
                    <Handle position={Position.Top} type="target" />
                    <div
                        className="hover:underline text-sm cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('clicked', data.name);
                            router.push(`/dashboard/groups/${data.id}`);
                            // updateSelectedGroup(data);
                        }}
                    >
                        {data.name}
                    </div>

                    <Handle type="source" position={Position.Bottom} id="a" />
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-45 ">
                <ContextMenuItem className="flex justify-between text-xs">
                    Add New Group <Plus />
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
