import { PageProps } from "@/app/page-props";
import { getSession } from "@/app/utils";
import { getPermissions } from "@/permissions/permissions";
import { getScopeProfile } from "@/prisma";
import { subject } from "@casl/ability";
import { notFound } from "next/navigation";

interface SecurityLevel {
    action?: 'edit' | 'access';
}

export const securelyGetScopeFromPageProps = async ({ params, action = 'edit' }: PageProps & SecurityLevel) => {
    const session = await getSession();

    if (!session) {
        notFound();
    }

    const scopeId = Number(params['scopeId']);
    const scope = await getScopeProfile(scopeId);

    const permissions = await getPermissions(session.user.id);

    if (!permissions.can(action, subject('Scope', { id: scope.id }))) {
        notFound();
    }

    return scope;
};