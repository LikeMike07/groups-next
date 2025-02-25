'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';

const LoginFormSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export default function LoginPage() {
    const router = useRouter();

    const login = trpc.auth.login.useMutation({
        onSuccess: () => {
            router.push('/dashboard');
        },
    });

    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    function handleSubmit(values: z.infer<typeof LoginFormSchema>) {
        login.mutate(values);
    }

    return (
        <div>
            <h2 className="text-lg font-mono">Login</h2>
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
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="password" type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="w-full flex flex-col items-end gap-2 justify-end">
                        <div className="flex justify-between w-full">
                            <Link href={'/first-time-setup'} className="underline">
                                First Time Setup
                            </Link>
                            <Link href={'/forgot-password'} className="underline">
                                Forgot Password
                            </Link>
                        </div>
                        <Button type="submit" className=" ">
                            Login
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
