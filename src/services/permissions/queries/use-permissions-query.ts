import { get } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';
import { useQuery } from '@tanstack/react-query';
import { AbilityRole } from '@/permissions/abilities';
import { ScopePostPermission } from '@/prisma/queries/get-scope-permissions';

interface PermissionsQueryResponse {
    roles: AbilityRole[];
    scopeRoles: ScopePostPermission[];
}

export const usePermissionsQuery = () => {
    return useQuery({
        queryKey: ['permissions'],
        queryFn: () =>
            get<PermissionsQueryResponse>(ENDPOINTS.permissions.base),
    });
};
