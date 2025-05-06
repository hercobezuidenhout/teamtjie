import { get } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';
import { useQuery } from '@tanstack/react-query';
import { ScopePostPermission } from '@/prisma/queries/get-scope-permissions';

export const useScopePermissionsQuery = (scopeId: number) => {
    const url = `${ENDPOINTS.scopes.base}/${scopeId}/permissions`;
    return useQuery({
        queryKey: ['scopes', scopeId, 'permissions'],
        queryFn: () =>
            get<ScopePostPermission[]>(url),
    });
};
