import { trpc } from '@/app/_trpc/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import RoleConfig from './role-config';

export default function GroupRoles(props: { groupId: number }) {
    const roles = trpc.group.getRoles.useQuery({ groupId: props.groupId });

    if (roles.isLoading) return <>Loading...</>;

    if (!roles.data) throw new Error('Unable to access group roles');

    return (
        <div>
            <Accordion type="multiple">
                {roles.data.map((role) => {
                    return (
                        <AccordionItem value={role.id.toString()} key={role.id} className="">
                            <AccordionTrigger className="cursor-pointer items-center">
                                <div>
                                    <h3>{role.name}</h3>
                                    <p className="text-muted-foreground text-sm">{role.description}</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <RoleConfig role={role} />
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}
