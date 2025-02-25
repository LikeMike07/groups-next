'use client';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const EmailCheckSchema = z.object({
    email: z.string().email(),
});

export default function FirstTimeSetup() {
    const router = useRouter();

    const form = useForm<z.infer<typeof EmailCheckSchema>>({
        resolver: zodResolver(EmailCheckSchema),
        defaultValues: {
            email: '',
        },
    });

    function handleSuccess(token: string) {
        router.push(`/first-time-setup/set-password?token=${token}`);
    }

    const checkEmail = trpc.auth.checkEmail.useMutation({
        onSuccess: (data) => handleSuccess(data.token),
        onError: (error) => form.setError('root', { message: error.message }),
    });

    function handleSubmit(values: z.infer<typeof EmailCheckSchema>) {
        checkEmail.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-5 space-y-2">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="example@email.com" />
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
