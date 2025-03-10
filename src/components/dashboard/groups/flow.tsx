'use client';
import {
    ReactFlow,
    Background,
    Controls,
    Node,
    Edge,
    useReactFlow,
    Panel,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
    addEdge,
    OnConnect,
} from '@xyflow/react';
import { useCallback, useMemo, useEffect, useState } from 'react';
import Dagre from '@dagrejs/dagre';
import { Button } from '@/components/ui/button';
import GroupNode from '@/components/dashboard/groups/group-node';

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: direction });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) =>
        g.setNode(node.id, {
            ...node,
            width: node.measured?.width ?? 0,
            height: node.measured?.height ?? 0,
        })
    );

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const position = g.node(node.id);
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            const x = position.x - (node.measured?.width ?? 0) / 2;
            const y = position.y - (node.measured?.height ?? 0) / 2;

            return { ...node, position: { x, y } };
        }),
        edges,
    };
};

export default function GroupsFlow(props: { nodes: Node[]; edges: Edge[] }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges);
    const nodeTypes = useMemo(() => ({ groupNode: GroupNode }), []);
    const [layoutApplied, setLayoutApplied] = useState(false);
    const [allNodesMeasured, setAllNodesMeasured] = useState(false);
    const { fitView } = useReactFlow();

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
        []
    );

    const onLayout = useCallback(
        (direction: 'TB' | 'LR') => {
            // Make sure nodes and edges are defined before proceeding
            if (!nodes || !edges) return;

            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);

            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
        },

        [nodes, edges]
    );

    // Custom nodes change handler to detect when measurements change
    const handleNodesChange = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (changes: any) => {
            onNodesChange(changes);

            // Reset the layout applied flag if nodes are being added or removed
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hasStructuralChanges = changes.some((change: any) => change.type === 'add' || change.type === 'remove');

            if (hasStructuralChanges && layoutApplied) {
                setLayoutApplied(false);
                setAllNodesMeasured(false);
            }
        },
        [onNodesChange, layoutApplied]
    );

    // Track if all nodes are measured
    useEffect(() => {
        if (!allNodesMeasured && nodes && nodes.length > 0) {
            const allMeasured = nodes.every((node) => node?.measured && node.measured?.width && node.measured?.height);
            if (allMeasured) {
                setAllNodesMeasured(true);
            }
        }
    }, [nodes, allNodesMeasured]);

    // Apply layout once all nodes are measured
    useEffect(() => {
        if (allNodesMeasured && !layoutApplied && nodes?.length > 0 && edges?.length > 0) {
            onLayout('TB'); // Use your preferred default direction
            setLayoutApplied(true);
        }
        window.requestAnimationFrame(() => {
            fitView();
        });
    }, [allNodesMeasured, layoutApplied, nodes, edges, onLayout]);

    return (
        <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            onConnect={onConnect}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
            className="shrink"
        >
            <Background />
            <Controls className="text-background" />
            <Panel position="top-right" className="space-x-2">
                <Button size={'icon'} onClick={() => onLayout('TB')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" className="fill-foreground">
                        <rect x="40" y="10" width="20" height="20" rx="3" className="fill-background" />

                        <rect x="49" y="30" width="2" height="10" className="fill-background" />

                        <rect x="20" y="40" width="60" height="2" className="fill-background" />

                        <rect x="10" y="50" width="20" height="20" rx="3" className="fill-background" />
                        <rect x="40" y="50" width="20" height="20" rx="3" className="fill-background" />
                        <rect x="70" y="50" width="20" height="20" rx="3" className="fill-background" />

                        <rect x="19" y="40" width="2" height="10" className="fill-background" />
                        <rect x="49" y="40" width="2" height="10" className="fill-background" />
                        <rect x="79" y="40" width="2" height="10" className="fill-background" />
                    </svg>
                </Button>
                <Button size={'icon'} onClick={() => onLayout('LR')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" className="fill-foreground -rotate-90">
                        <rect x="40" y="10" width="20" height="20" rx="3" className="fill-background" />

                        <rect x="49" y="30" width="2" height="10" className="fill-background" />

                        <rect x="20" y="40" width="60" height="2" className="fill-background" />

                        <rect x="10" y="50" width="20" height="20" rx="3" className="fill-background" />
                        <rect x="40" y="50" width="20" height="20" rx="3" className="fill-background" />
                        <rect x="70" y="50" width="20" height="20" rx="3" className="fill-background" />

                        <rect x="19" y="40" width="2" height="10" className="fill-background" />
                        <rect x="49" y="40" width="2" height="10" className="fill-background" />
                        <rect x="79" y="40" width="2" height="10" className="fill-background" />
                    </svg>
                </Button>
            </Panel>
        </ReactFlow>
    );
}
