'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb';

export default function Breadcrumbs() {
    const pathname = usePathname();
    const paths = pathname.split('/');

    return (
        <Breadcrumb>
            <BreadcrumbList className="inline-flex items-baseline">
                {paths.map(
                    (path, i, arr) =>
                        path.length > 0 && (
                            <div key={path} className="inline-flex items-center gap-2">
                                <BreadcrumbItem>
                                    <BreadcrumbLink>{path}</BreadcrumbLink>
                                </BreadcrumbItem>
                                {arr.length > i + 1 && <BreadcrumbSeparator key={`seperator-${i}`} />}
                            </div>
                        )
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
