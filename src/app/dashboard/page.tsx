import Greeting from '@/components/dashboard/greeting';
import GroupStats from '@/components/dashboard/group-stats';

export default async function Dashboard() {
    return (
        <div className="mt-4 space-y-2">
            <Greeting />
            <GroupStats />
        </div>
    );
}
