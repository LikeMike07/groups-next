import { Form, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { roleSchema } from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import GroupsRoleConfig from './role-config-groups';

export interface Role extends z.infer<typeof roleSchema> {
    groupId: number | null;
}

export const roleInfo = {
    isAdmin: {
        label: 'Admin',
        description: 'Access to all permissions',
    },
    canUseGroups: {
        label: 'Groups',
        description: 'Allows user access to Groups. An app for managing groups and adding members',
    },
    canEditGroup: {
        label: 'Edit Group',
        description: 'Editing group name, image, and create new children groups.',
    },
    canAddMembers: {
        label: 'Add Members',
        description: 'Invite new members to the group.',
    },
    canViewGroup: {
        label: 'View Group',
        description: "View only. Only applies when user doesn't have above permissions.",
    },
    canManageRoles: {
        label: 'Manage Roles',
        description: 'Creation of new roles and editing of existing roles.',
    },
    canUseDirectory: {
        label: 'Directory',
        description: 'Access to Directory app. Access to view group members.',
    },
    canViewInheritedMembers: {
        label: 'View Inherited Members',
        description: 'Allows user to View members from children groups',
    },
    canViewSensitiveData: {
        label: 'View Sensitive Data',
        description: 'Allows user to view contact information such as email & phone numbers.',
    },
};

export default function RoleConfig(props: { role: Role }) {
    const form = useForm<z.infer<typeof roleSchema>>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            ...props.role,
        },
    });

    return (
        <div className="mt-2">
            <Form {...form}>
                <form className="space-y-2">
                    <div className="p-2 bg-muted/60 rounded-lg">
                        <FormField
                            control={form.control}
                            name="isAdmin"
                            render={({ field }) => {
                                return (
                                    <FormItem className="grid grid-cols-3 items-center">
                                        <div className="w-full col-span-2">
                                            <FormLabel>{roleInfo.isAdmin.label}</FormLabel>
                                            <FormDescription className="text-xs">{roleInfo.isAdmin.description}</FormDescription>
                                        </div>
                                        <Switch className="justify-self-end" checked={field.value} />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>
                    <div className={form.getValues('isAdmin') ? 'opacity-60 pointer-events-none' : 'opacity-100'}>
                        <div className="p-2 bg-muted/60 rounded-lg space-y-2">
                            <GroupsRoleConfig form={form} />
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
