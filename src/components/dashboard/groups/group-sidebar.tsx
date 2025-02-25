import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const WIDTH = '32rem';

export function GroupSidebar(props: { open: boolean; children: ReactNode }) {
    const state = props.open ? 'expanded' : 'collapsed';

    return (
        <div
            className="group peer text-sidebar-foreground hidden md:block h-full"
            data-state={state}
            data-slot="group-sidebar"
            style={{ '--groupsidebar-width': WIDTH } as React.CSSProperties}
            data-collapsible={state === 'collapsed' ? 'offcanvas' : ''}
        >
            <div
                className={cn(
                    'relative h-full w-(--groupsidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
                    'group-data-[collapsible=offcanvas]:w-0',
                    'rotate-180',
                    'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
                )}
            />
            <div
                className={cn(
                    'absolute inset-y-0 z-10 hidden h-full w-(--groupsidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
                    'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--groupsidebar-width)*-1)]',
                    // Adjust the padding for floating and inset variants.
                    'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l'
                )}
                {...props}
            >
                <div
                    data-sidebar="sidebar"
                    className="bg-sidebar border-l group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
                >
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export function GroupSidebarContent(props: { children: ReactNode }) {
    return <div className="p-4">{props.children}</div>;
}
