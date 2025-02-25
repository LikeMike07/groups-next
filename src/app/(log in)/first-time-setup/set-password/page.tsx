import SetPasswordForm from './SetPasswordForm';

export default async function SetPassword(props: { searchParams: Promise<{ token: string }> }) {
    const searchParams = await props.searchParams;
    return (
        <div>
            <h3 className="mt-2">Set a password</h3>
            <SetPasswordForm token={searchParams.token} />
        </div>
    );
}
