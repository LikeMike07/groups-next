import Group from '@/components/dashboard/groups/group/group';

export default async function GroupPage(props: { params: Promise<{ groupId: number }> }) {
    const { groupId } = await props.params;

    return <Group groupId={groupId} />;
}
