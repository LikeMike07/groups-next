import { Group } from '@/app/dashboard/groups/Provider';
import GroupHeader from './group-header';
import { trpc } from '@/app/_trpc/client';
import GroupChildren from './group-children';
import GroupMembers from './group-members';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function GroupDetail(props: { group: Group }) {
    const group = trpc.group.getGroup.useQuery({ groupId: props.group.id });

    if (group.isLoading) return <>Loading...</>;

    if (!group.data) {
        throw new Error('group not found');
    }

    return (
        <div key={props.group.id}>
            <GroupHeader group={group.data} />
            <Accordion type="multiple" defaultValue={['members']}>
                <AccordionItem value="structure">
                    <AccordionTrigger>Group Structure</AccordionTrigger>
                    <AccordionContent>
                        <GroupChildren group={group.data} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="members">
                    <AccordionTrigger>Members</AccordionTrigger>
                    <AccordionContent>
                        <GroupMembers groupId={group.data.id} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
