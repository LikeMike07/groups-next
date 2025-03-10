import Breadcrumbs from '@/components/dashboard/breadcrumbs';
import LogoutButton from '@/components/nav/logout-button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ui/toggle-theme-button';
import { ReactNode } from 'react';

export default function DashboardLayout(props: { children: ReactNode }) {
    return (
        <div className=" mx-auto ">
            <SidebarProvider defaultOpen={false}>
                <Sidebar>
                    <SidebarHeader />
                    <SidebarContent>
                        <SidebarGroup />
                        <SidebarGroup />
                    </SidebarContent>
                    <SidebarFooter>
                        <LogoutButton />
                    </SidebarFooter>
                </Sidebar>
                <main className=" w-full">
                    <div className="flex justify-between items-center px-2 py-1 bg-muted">
                        <div className="flex items-center gap-4 ">
                            <SidebarTrigger />
                            <Breadcrumbs />
                        </div>
                        <ModeToggle />
                    </div>
                    <div className=" ">{props.children}</div>
                </main>
            </SidebarProvider>
        </div>
    );
}
