'use client';
import { Group, useGroupPageContext } from '@/app/dashboard/groups/Provider';
import { Handle, Position } from '@xyflow/react';

interface Props {
    data: Group;
}
export default function GroupNode({ data }: Props) {
    const { updateSelectedGroup } = useGroupPageContext();

    return (
        <div className="p-3 bg-background border rounded">
            <Handle position={Position.Top} type="target" />
            <div
                className="hover:underline text-sm cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log('clicked', data.name);
                    updateSelectedGroup(data);
                }}
            >
                {data.name}
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
        </div>
    );
}
