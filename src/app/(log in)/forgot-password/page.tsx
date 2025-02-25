'use client';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const EmailCheckSchema = z.object({
    email: z.string().email(),
});

export default function ForgotPasswordPage() {
    const form = useForm<z.infer<typeof EmailCheckSchema>>({
        resolver: zodResolver(EmailCheckSchema),
        defaultValues: {
            email: '',
        },
    });

    function handleSubmit(values: z.infer<typeof EmailCheckSchema>) {
        console.log(values);
    }

    return (
        <div>
            <h2 className="font-mono text-lg">Forgot Password</h2>
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
                    <div className="w-full flex flex-col items-end gap-2 justify-end">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
