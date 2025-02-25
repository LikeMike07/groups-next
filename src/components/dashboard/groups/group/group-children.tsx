import { Group, GroupDetail } from '@/app/dashboard/groups/Provider';
import React, { JSX } from 'react';
import { Inconsolata } from 'next/font/google';

const jetBrainsMono = Inconsolata({
    subsets: ['latin'],
    weight: ['400'],
});

export default function GroupChildren(props: { group: GroupDetail }) {
    // Find direct children of the current group
    const getDirectChildren = () => {
        // Get the current group's path
        const currentPath = props.group.path;

        // Filter children to only include direct children of the current group
        return props.group.children.filter((child) => {
            const childPath = child.path;
            const childPathParts = childPath.split('.');
            const currentPathParts = currentPath.split('.');

            // Direct children have exactly one more path segment than the parent
            return childPathParts.length === currentPathParts.length + 1 && childPath.startsWith(currentPath);
        });
    };

    // Build tree structure from group's children
    const buildTree = () => {
        // Get direct children
        const directChildren = getDirectChildren();

        // Create a map to store each node by its path
        const nodeMap: Record<string, { node: Group; children: Group[] }> = {};

        // Initialize with direct children
        directChildren.forEach((child) => {
            nodeMap[child.path] = { node: child, children: [] };
        });

        // Find children for each node
        props.group.children.forEach((child) => {
            const pathParts = child.path.split('.');

            // Skip direct children of the current group (already added)
            if (pathParts.length <= props.group.path.split('.').length + 1) {
                return;
            }

            // Find the parent path
            const parentPathParts = pathParts.slice(0, -1);
            const parentPath = parentPathParts.join('.');

            // If parent exists in our map, add this as its child
            if (nodeMap[parentPath]) {
                nodeMap[parentPath].children.push(child);

                // Make sure this child is also in the map
                if (!nodeMap[child.path]) {
                    nodeMap[child.path] = { node: child, children: [] };
                }
            }
        });

        return { directChildren, nodeMap };
    };

    // Render the tree
    const renderTree = () => {
        const { directChildren, nodeMap } = buildTree();
        const lines: JSX.Element[] = [];

        // Add root (current group)
        lines.push(
            <div key={props.group.id} className="font-mono text-sm">
                {props.group.name}
            </div>
        );

        // Render a node and its children
        const renderNode = (node: Group, level: number, prefix: string, isLast: boolean) => {
            // Current node prefix
            const nodePrefix = level === 1 ? (isLast ? '└── ' : '├── ') : prefix + (isLast ? '└── ' : '├── ');

            // Add this node
            lines.push(
                <div key={node.id} className={` whitespace-pre text-sm`}>
                    {nodePrefix}
                    {node.name}
                </div>
            );

            // Prefix for children
            const childPrefix = level === 1 ? (isLast ? '    ' : '│   ') : prefix + (isLast ? '    ' : '│   ');

            // Get children for this node
            const children = nodeMap[node.path]?.children || [];

            // Render each child
            children.forEach((child, index) => {
                renderNode(child, level + 1, childPrefix, index === children.length - 1);
            });
        };

        // Render direct children
        directChildren.forEach((child, index) => {
            renderNode(child, 1, '', index === directChildren.length - 1);
        });

        return lines;
    };

    return <div className={jetBrainsMono.className}>{renderTree()}</div>;
}
