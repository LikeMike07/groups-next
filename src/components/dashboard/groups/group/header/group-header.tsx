import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog } from '@/components/ui/dialog';
import { RouterOutputs } from '@/server';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import EditGroupDialogContent from './group-edit';
import { Button } from '@/components/ui/button';

export default function GroupHeader(props: { group: RouterOutputs['group']['getGroup'] }) {
    const { group } = props;

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    return (
        <div className="grid-cols-3 grid group">
            <div
                className="flex items-center p-2 max-w-xl border-r gap-2 relative"
                style={{ backgroundImage: `url('${group.bannerImgUrl}')`, backgroundSize: 'cover' }}
            >
                <div className="z-0 bg-gradient-to-b from-black/0 to-black/40 absolute w-full h-full left-0" />

                <Avatar className="h-18 w-18 border border-border/40">
                    <AvatarImage className=" bg-background/70" src={group.imgUrl ?? ''} />
                    <AvatarFallback className="text-3xl">{group.name[0] ?? '?'}</AvatarFallback>
                </Avatar>
                <h1 className="text-xl bg-background/70 p-2 rounded-lg">{group.name}</h1>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={(open) => (open ? setIsEditDialogOpen(true) : setIsEditDialogOpen(false))}>
                <EditGroupDialogContent group={group} />
            </Dialog>

            <div className="col-span-2 p-2 bg-muted/20 font-mono text-sm flex justify-between">
                <div>
                    <p>{group.description}</p>
                    <p>{group.location}</p>
                </div>
                <Button
                    size={'icon'}
                    className=" opacity-0 group-hover:opacity-100 flex transition duration-100"
                    onClick={() => setIsEditDialogOpen(true)}
                >
                    <Edit className="m-auto" />
                </Button>
            </div>
        </div>
    );
}
