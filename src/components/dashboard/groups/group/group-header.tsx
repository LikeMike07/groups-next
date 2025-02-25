import { trpc } from '@/app/_trpc/client';
import { GroupDetail } from '@/app/dashboard/groups/Provider';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
    name: z.string().min(1),
});

export default function GroupHeader(props: { group: GroupDetail }) {
    const [isEditing, setIsEditing] = useState(false);
    const utils = trpc.useUtils();

    const editName = trpc.group.updateGroupName.useMutation({
        onSuccess: () => {
            setIsEditing(false);
            utils.group.getGroup.invalidate({ groupId: props.group.id });
        },
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { name: props.group.name },
    });

    function handleSave(values: z.infer<typeof FormSchema>) {
        if (values.name === props.group.name) {
            setIsEditing(false);
        } else {
            editName.mutate({ name: values.name, groupId: props.group.id });
        }
    }

    return (
        <>
            {isEditing ? (
                <>
                    <Form {...form}>
                        <form className="flex items-center gap-2" onSubmit={form.handleSubmit(handleSave)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <Input {...field} />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" size={'icon'}>
                                <Save />
                            </Button>
                        </form>
                    </Form>
                </>
            ) : (
                <div className="flex items-center gap-2">
                    <h2 className="font-mono text-lg">{props.group.name}</h2>
                    <Button onClick={() => setIsEditing(true)} variant={'ghost'} size={'icon'}>
                        <Edit />
                    </Button>
                </div>
            )}
        </>
    );
}
