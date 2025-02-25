import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const getPathSegments = (path: string): string[] => path.split('.');

export const createEdgesFromPaths = (groups: { id: number; path: string; name: string; imgUrl: string | null }[]) => {
    const edges: { id: string; source: string; target: string }[] = [];
    const pathToId = new Map<string, string>();

    // First, create a mapping of full paths to node IDs
    groups.forEach((group) => {
        const segments = getPathSegments(group.path);
        const fullPath = segments.join('.');
        pathToId.set(fullPath, group.id.toString());
    });

    // Then create edges between parent and child nodes
    groups.forEach((group) => {
        const segments = getPathSegments(group.path);

        // Skip if this is a root node (no parent)
        if (segments.length <= 1) return;

        // Get the parent path by removing the last segment
        const parentSegments = segments.slice(0, -1);
        const parentPath = parentSegments.join('.');

        // If we have both parent and child IDs, create an edge
        const parentId = pathToId.get(parentPath);
        const childId = group.id.toString();

        if (parentId && childId) {
            edges.push({
                id: `${parentId}-${childId}`,
                source: parentId,
                target: childId,
            });
        }
    });

    return edges;
};
