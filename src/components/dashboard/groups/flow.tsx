'use client';
import { ReactFlow, Background, Controls, Node, Edge, useReactFlow, Panel, useNodesState, useEdgesState } from '@xyflow/react';
import { useCallback, useMemo } from 'react';
import Dagre from '@dagrejs/dagre';
import { Button } from '@/components/ui/button';
import GroupNode from './group-node';

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
    const { fitView } = useReactFlow();
    const nodeTypes = useMemo(() => ({ groupNode: GroupNode }), []);

    const onLayout = useCallback(
        (direction: 'TB' | 'LR') => {
            const layouted = getLayoutedElements(nodes, edges, direction);

            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);

            window.requestAnimationFrame(() => {
                fitView();
            });
        },
        [nodes, edges, fitView, setEdges, setNodes]
    );

    return (
        <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            className="shrink"
        >
            <Background />
            <Controls />
            <Panel position="top-right" className="space-x-2">
                <Button size={'icon'} onClick={() => onLayout('TB')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" className="fill-foreground">
                        <rect x="40" y="10" width="20" height="20" rx="3" fill="#f1f1f1" />

                        <rect x="49" y="30" width="2" height="10" fill="#f1f1f1" />

                        <rect x="20" y="40" width="60" height="2" fill="#f1f1f1" />

                        <rect x="10" y="50" width="20" height="20" rx="3" fill="#f1f1f1" />
                        <rect x="40" y="50" width="20" height="20" rx="3" fill="#f1f1f1" />
                        <rect x="70" y="50" width="20" height="20" rx="3" fill="#f1f1f1" />

                        <rect x="19" y="40" width="2" height="10" fill="#f1f1f1" />
                        <rect x="49" y="40" width="2" height="10" fill="#f1f1f1" />
                        <rect x="79" y="40" width="2" height="10" fill="#f1f1f1" />
                    </svg>
                </Button>
                <Button size={'icon'} onClick={() => onLayout('LR')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" className="fill-foreground -rotate-90">
                        <rect x="40" y="10" width="20" height="20" rx="3" fill="#f1f1f1" />

                        <rect x="49" y="30" width="2" height="10" fill="#f1f1f1" />

                        <rect x="20" y="40" width="60" height="2" fill="#f1f1f1" />

                        <rect x="10" y="50" width="20" height="20" rx="3" fill="#f1f1f1" />
                        <rect x="40" y="50" width="20" height="20" rx="3" fill="#f1f1f1" />
                        <rect x="70" y="50" width="20" height="20" rx="3" fill="#f1f1f1" />

                        <rect x="19" y="40" width="2" height="10" fill="#f1f1f1" />
                        <rect x="49" y="40" width="2" height="10" fill="#f1f1f1" />
                        <rect x="79" y="40" width="2" height="10" fill="#f1f1f1" />
                    </svg>
                </Button>
            </Panel>
        </ReactFlow>
    );
}
