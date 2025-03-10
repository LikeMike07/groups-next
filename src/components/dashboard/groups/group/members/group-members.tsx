import { trpc } from '@/app/_trpc/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';
import AddMemberDialogContent from './add-member-dialog';

export default function GroupMembers(props: { groupId: number }) {
    const members = trpc.group.getMembersOfGroup.useQuery({ groupId: props.groupId });

    return (
        <div>
            <div className="flex justify-between">
                <Input className="px-2  max-w-sm" placeholder="Search" />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={'icon'}>
                            <UserPlus />
                        </Button>
                    </DialogTrigger>
                    <AddMemberDialogContent groupId={props.groupId} />
                </Dialog>
            </div>
            <ul className=" mt-2 divide-y border-y rounded-lg overflow-auto bg-muted/20">
                {members.data?.map((member) => (
                    <li className="p-2 border-x flex gap-2 items-center" key={member.id}>
                        <Avatar>
                            <AvatarImage src={member.imgUrl ?? ''}></AvatarImage>
                            <AvatarFallback className="">{member.first_name[0] + member.last_name[0]}</AvatarFallback>
                        </Avatar>
                        {member.first_name} {member.last_name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
