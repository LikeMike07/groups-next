import { trpc } from '@/app/_trpc/client';

export default function GroupMembers(props: { groupId: number }) {
    const members = trpc.group.getMembersOfGroup.useQuery({ groupId: props.groupId });

    return (
        <ul>
            {members.data?.map((member) => (
                <li key={member.memberships.user_id}>{member.users.first_name}</li>
            ))}
        </ul>
    );
}
