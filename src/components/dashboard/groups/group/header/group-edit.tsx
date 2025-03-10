import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UploadDropzone } from '@/components/uploadthing/uploadthing';
import { cn } from '@/lib/utils';
import { RouterOutputs } from '@/server';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadButton } from '@/components/uploadthing/uploadthing';
import { Edit } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '@/app/_trpc/client';

const groupDetailsSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    description: z.string().max(255, 'Description must not exceed 255 characters.'),
    location: z.string().optional(),
    imgUrl: z.string().nullable(),
    bannerImgUrl: z.string().nullable(),
});

export default function EditGroupDialogContent(props: { group: RouterOutputs['group']['getGroup']; onSuccess: () => void }) {
    const { group } = props;
    const utils = trpc.useUtils();
    const [isUploadImgDialogOpen, setIsUploadImgDialogOpen] = useState(false);
    const [isUploadBannerImgDialogOpen, setIsUploadBannerImgDialogOpen] = useState(false);

    const updateGroupDetails = trpc.group.editGroupDetails.useMutation({
        onSuccess: (res, input) => {
            utils.group.getGroup.invalidate({ groupId: input.groupId });
            props.onSuccess();
        },
    });

    const form = useForm<z.infer<typeof groupDetailsSchema>>({
        resolver: zodResolver(groupDetailsSchema),
        defaultValues: {
            name: group.name,
            description: group.description,
            imgUrl: group.imgUrl,
            location: group.location ?? '',
            bannerImgUrl: group.bannerImgUrl,
        },
        shouldUnregister: true,
    });

    function handleSubmit(values: z.infer<typeof groupDetailsSchema>) {
        updateGroupDetails.mutate({ groupId: group.id, details: { ...values } });
    }

    return (
        <DialogContent className="p-0 overflow-auto gap-0">
            <DialogTitle className="sr-only">Edit group name and images</DialogTitle>
            <DialogDescription className="sr-only">Change the name of your group</DialogDescription>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit, (errors) => console.error(errors))}>
                    <FormField
                        control={form.control}
                        name="bannerImgUrl"
                        render={({ field }) => (
                            <div
                                style={{ backgroundImage: `url('${field.value}')`, backgroundSize: 'cover' }}
                                className="group/banner relative border-b p-4 flex items-center gap-2"
                            >
                                <div className="z-0 bg-gradient-to-b from-black/0 to-black/40 absolute w-full h-full left-0" />
                                <Button
                                    type="button"
                                    size={'icon'}
                                    variant={'ghost'}
                                    className="absolute bottom-2 text-white right-2 group-hover/banner:opacity-100 opacity-0 transition duration-300"
                                    onClick={() => setIsUploadBannerImgDialogOpen(true)}
                                >
                                    <Edit />
                                </Button>
                                {/* banner image upload */}
                                <Dialog
                                    open={isUploadBannerImgDialogOpen}
                                    onOpenChange={(open) => (open ? setIsUploadBannerImgDialogOpen(true) : setIsUploadBannerImgDialogOpen(false))}
                                >
                                    <DialogContent>
                                        <DialogTitle>Upload a banner image</DialogTitle>
                                        <DialogDescription className="sr-only">
                                            upload an image to be displayed in the background of your group&apos;s banner
                                        </DialogDescription>
                                        {field.value ? (
                                            <div>
                                                <Image
                                                    src={field.value}
                                                    width={500}
                                                    className="aspect-[4/1] object-cover"
                                                    height={50}
                                                    alt="uploaded banner image"
                                                />
                                                <div className="flex gap-1 mt-4">
                                                    <Button
                                                        onClick={() => {
                                                            // setUploadedBannerImg(null);
                                                            form.setValue('bannerImgUrl', null);
                                                        }}
                                                        variant={'ghost'}
                                                        className=""
                                                    >
                                                        Clear
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        className="w-full"
                                                        onClick={() => {
                                                            // form.setValue('bannerImgUrl', uploadedBannerImg.ufsUrl);
                                                            setIsUploadBannerImgDialogOpen(false);
                                                        }}
                                                    >
                                                        Submit
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <UploadDropzone
                                                className="ut-button:bg-background ut-button:border flex-col gap-2 ut-button:border-dashed ut-button:text-forground ut-button:ut-uploading:after:bg-muted-foreground! ut-button:ring-muted-foreground"
                                                endpoint={'imageUploader'}
                                                onClientUploadComplete={(res) => {
                                                    form.setValue('bannerImgUrl', res[0].ufsUrl);
                                                }}
                                            />
                                        )}
                                    </DialogContent>
                                </Dialog>
                                <FormField
                                    control={form.control}
                                    name="imgUrl"
                                    render={({ field }) => (
                                        <>
                                            <Avatar className="h-18 w-18 group">
                                                <div
                                                    className="w-full h-full opacity-0 group-hover:opacity-100 flex bg-black/60 absolute transition duration-100"
                                                    onClick={() => setIsUploadImgDialogOpen(true)}
                                                >
                                                    <Edit className="m-auto text-white" />
                                                </div>
                                                <AvatarImage src={field.value ?? ''} />
                                                <AvatarFallback className="text-3xl">{group.name[0] ?? '?'}</AvatarFallback>
                                            </Avatar>
                                            {/* avatar image upload */}
                                            <Dialog
                                                open={isUploadImgDialogOpen}
                                                onOpenChange={(open) => (open ? setIsUploadImgDialogOpen(true) : setIsUploadImgDialogOpen(false))}
                                            >
                                                <DialogContent>
                                                    <DialogTitle className="sr-only">Upload an image</DialogTitle>
                                                    <DialogDescription className="sr-only">
                                                        upload an image to be displayed as your group&apos;s avatar / logo
                                                    </DialogDescription>
                                                    <div className="flex flex-col items-center gap-10">
                                                        <Avatar className="h-32 w-32 group">
                                                            <div
                                                                className="w-full h-full opacity-0 group-hover:opacity-100 flex bg-black/60 absolute transition duration-100"
                                                                onClick={() => setIsUploadImgDialogOpen(true)}
                                                            >
                                                                <Edit className="m-auto text-white" />
                                                            </div>
                                                            <AvatarImage src={field.value ?? ''} />
                                                            <AvatarFallback className="text-4xl">{group.name[0] ?? '?'}</AvatarFallback>
                                                        </Avatar>
                                                        <UploadButton
                                                            endpoint={'imageUploader'}
                                                            className="ut-button:bg-background ut-button:border flex-col gap-2 ut-button:border-dashed ut-button:text-forground ut-button:ut-uploading:after:bg-muted-foreground! ut-button:ring-muted-foreground"
                                                            onClientUploadComplete={(res) => {
                                                                form.setValue('imgUrl', res[0].ufsUrl);
                                                            }}
                                                        />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <Input
                                            className={cn(
                                                'bg-black/40 text-white field-sizing-content w-fit text-xl! z-10 border-0 focus:ring-0!  focus:border-0! focus:outline-0!'
                                            )}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        )}
                    />
                    <div className="h-fit p-4 text-sm flex flex-col">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className="mb-2">
                                    <FormLabel>Location</FormLabel>
                                    <Input className="resize-none" {...field}></Input>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea className="resize-none" {...field}></Textarea>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="mt-4">
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
    );
}
