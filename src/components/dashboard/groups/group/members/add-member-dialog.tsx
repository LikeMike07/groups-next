'use client';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UploadButton } from '@/components/uploadthing/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import Image from 'next/image';
import { X } from 'lucide-react';

const newMemberSchema = z.object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    email: z.string().email(),
    imgUrl: z.string().optional(),
});

export default function AddMemberDialogContent(props: { groupId: number }) {
    const addNewMember = trpc.group.addUserToGroup.useMutation();
    const [isUploadImageDisabled, setIsUploadImageDisabled] = useState(false);
    const form = useForm<z.infer<typeof newMemberSchema>>({
        resolver: zodResolver(newMemberSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            imgUrl: undefined,
        },
        shouldUnregister: true,
    });

    function handlSubmit(values: z.infer<typeof newMemberSchema>) {
        console.log(values);
        addNewMember.mutate({ groupId: props.groupId, user: values });
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>New Member</DialogTitle>
                <DialogDescription className="sr-only">Add a new member</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handlSubmit)} className="space-y-2">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="imgUrl"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <div className="flex">
                                        {field.value ? (
                                            <div className="flex items-center gap-2 border border-dashed p-2 rounded-lg">
                                                <Image src={field.value} width={32} height={32} alt="uploaded image" />
                                                <Button size={'icon'} variant={'ghost'} type="button" onClick={() => form.resetField('imgUrl')}>
                                                    <X />
                                                </Button>
                                            </div>
                                        ) : (
                                            <UploadButton
                                                className="ut-button:bg-background ut-button:border flex-row gap-2 ut-button:border-dashed ut-button:text-forground ut-button:ut-uploading:after:bg-muted-foreground! ut-button:ring-muted-foreground"
                                                config={{ cn: twMerge }}
                                                endpoint="imageUploader"
                                                onClientUploadComplete={(res) => {
                                                    // Do something with the response
                                                    form.setValue('imgUrl', res[0].ufsUrl);
                                                }}
                                                onUploadError={(error: Error) => {
                                                    // Do something with the error.
                                                    alert(`ERROR! ${error.message}`);
                                                }}
                                            />
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </DialogContent>
    );
}
