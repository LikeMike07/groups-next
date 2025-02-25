export default async function GroupPage(props: { params: Promise<{ groupId: number }> }) {
    const { groupId } = await props.params;

    return <div>{groupId}</div>;
}
