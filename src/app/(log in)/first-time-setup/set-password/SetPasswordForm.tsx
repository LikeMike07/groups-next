'use client';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SetPasswordFormSchema = z
    .object({
        password: z.string().min(8, { message: 'password must be atleast 6 characters long.' }),
        confirmPassword: z.string().min(8, { message: 'password must be atleast 6 characters long.' }),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'The passwords do not match',
                path: ['confirmPassword'],
            });
        }
    });

export default function SetPasswordForm(props: { token: string }) {
    const form = useForm<z.infer<typeof SetPasswordFormSchema>>({
        resolver: zodResolver(SetPasswordFormSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const setPassword = trpc.auth.setPassword.useMutation();

    function handleSubmit(values: z.infer<typeof SetPasswordFormSchema>) {
        setPassword.mutate({ password: values.password, token: props.token });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-5 space-y-2">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {form.formState.errors.root && <FormMessage>{form.formState.errors.root.message}</FormMessage>}
                <div className="w-full flex flex-col items-end gap-2 justify-end">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    );
}
