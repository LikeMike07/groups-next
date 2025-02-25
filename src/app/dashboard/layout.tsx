import Breadcrumbs from '@/components/dashboard/breadcrumbs';
import LogoutButton from '@/components/nav/logout-button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
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
                    <div className="flex items-center gap-4 p-2">
                        <SidebarTrigger />
                        <Breadcrumbs />
                    </div>
                    <div className=" ">{props.children}</div>
                </main>
            </SidebarProvider>
        </div>
    );
}
