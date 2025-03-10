import { FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { roleInfo } from './role-config';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { roleSchema } from '@/lib/constants';
import { Switch } from '@/components/ui/switch';

export default function GroupsRoleConfig(props: { form: UseFormReturn<z.infer<typeof roleSchema>> }) {
    const { form } = props;

    return (
        <>
            <FormField
                control={form.control}
                name="canUseGroups"
                render={({ field }) => {
                    return (
                        <FormItem className="grid grid-cols-3 items-center">
                            <div className="w-full col-span-2">
                                <FormLabel>{roleInfo.canUseGroups.label}</FormLabel>
                                <FormDescription className="text-xs ">{roleInfo.canUseGroups.description}</FormDescription>
                            </div>
                            <Switch className="justify-self-end" checked={field.value} />
                        </FormItem>
                    );
                }}
            />
            <div className="pl-10 divide-y">
                <FormField
                    control={form.control}
                    name="canUseGroups"
                    render={({ field }) => {
                        return (
                            <FormItem className="grid grid-cols-3 py-2   items-center">
                                <div className="w-full col-span-2">
                                    <FormLabel>{roleInfo.canEditGroup.label}</FormLabel>
                                    <FormDescription className="text-xs ">{roleInfo.canEditGroup.description}</FormDescription>
                                </div>
                                <Switch className="justify-self-end" checked={field.value} />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={form.control}
                    name="canUseGroups"
                    render={({ field }) => {
                        return (
                            <FormItem className="grid grid-cols-3 py-2   items-center">
                                <div className="w-full col-span-2">
                                    <FormLabel>{roleInfo.canAddMembers.label}</FormLabel>
                                    <FormDescription className="text-xs ">{roleInfo.canAddMembers.description}</FormDescription>
                                </div>
                                <Switch className="justify-self-end" checked={field.value} />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={form.control}
                    name="canUseGroups"
                    render={({ field }) => {
                        return (
                            <FormItem className="grid grid-cols-3 py-2   items-center">
                                <div className="w-full col-span-2">
                                    <FormLabel>{roleInfo.canManageRoles.label}</FormLabel>
                                    <FormDescription className="text-xs ">{roleInfo.canManageRoles.description}</FormDescription>
                                </div>
                                <Switch className="justify-self-end" checked={field.value} />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={form.control}
                    name="canUseGroups"
                    render={({ field }) => {
                        return (
                            <FormItem className="grid grid-cols-3 py-2   items-center">
                                <div className="w-full col-span-2">
                                    <FormLabel>{roleInfo.canViewGroup.label}</FormLabel>
                                    <FormDescription className="text-xs ">{roleInfo.canViewGroup.description}</FormDescription>
                                </div>
                                <Switch className="justify-self-end" checked={field.value} />
                            </FormItem>
                        );
                    }}
                />
            </div>
        </>
    );
}
