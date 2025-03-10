import { roleSchema } from '@/lib/constants';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export default function DirectoryRoleConfig(props: { form: UseFormReturn<z.infer<typeof roleSchema>> }) {
    // const { form } = props;
    console.log(props);
}
