import { ScopePostPermission } from "@/prisma/queries/get-scope-permissions";
import { AbilityTuple, defineAbility, MongoAbility, MongoQuery } from "@casl/ability";
import { RoleType, ScopeType } from "@prisma/client";

export interface AbilityProtected {
    permissions: MongoAbility<AbilityTuple, MongoQuery>;
}

export interface AbilityRole {
    userId: string;
    scopeId: number;
    role: RoleType;
    scopeType: ScopeType;
}

export const abilities = (roles: AbilityRole[], scopeRoles: ScopePostPermission[]) =>
    defineAbility((can, cannot) => {
        /**
         * ACCESS
         * 
         * Can access scope's name and logo
         */
        roles.forEach(role => can('access', 'Scope', { id: role.scopeId }));

        /**
         * READ
         * 
         * Can access scope's members, posts, teams, reactions & charter.
         * Can create posts, teams & reactions
         */
        roles
            .filter(role => role.role !== 'GUEST')
            .forEach(role => can('read', 'Scope', { id: role.scopeId }));

        roles
            .filter(role => role.scopeType === 'TEAM' && role.role === 'GUEST')
            .forEach(role => can('read', 'Scope', { id: role.scopeId }));

        /**
         * INVITE
         * 
         * Only admins and members can invite new users. Guests are not allowed to invite new users. 
         * Members can invite members and guests.
         * Admins can invite admins, members and guests.
         */
        roles
            .filter(role => role.role !== 'GUEST')
            .forEach(role => {
                can('invite', 'Scope', { id: role.scopeId });
                can('invite', 'Scope', { id: role.scopeId, role: 'MEMBER' });
                can('invite', 'Scope', { id: role.scopeId, role: 'GUEST' });
                cannot('invite', 'Scope', { id: role.scopeId, role: 'ADMIN' });
            });

        roles
            .filter(role => role.role === 'ADMIN')
            .forEach(role => can('invite', 'Scope', { id: role.scopeId, role: 'ADMIN' }));

        /**
         * EDIT
         * 
         * Only admins can view settings, update settings, edit charter & edit members
         */
        roles
            .filter(role => role.role === 'ADMIN')
            .forEach(role => can('edit', 'Scope', { id: role.scopeId }));

        /**
         * POST
         * 
         * Posting fines, wins and payments
         */
        roles
            .forEach(role => {
                can('post', 'Post', { scopeId: role.scopeId, type: 'FINE' });
                can('post', 'Post', { scopeId: role.scopeId, type: 'WIN' });
                can('post', 'Post', { scopeId: role.scopeId, type: 'PAYMENT' });
            });

        roles
            .forEach(role => {
                can('read', 'Post', { scopeId: role.scopeId, type: 'FINE' });
                can('read', 'Post', { scopeId: role.scopeId, type: 'WIN' });
                can('read', 'Post', { scopeId: role.scopeId, type: 'PAYMENT' });
            });

        roles
            .forEach(role => {
                can('view_author', 'Post', { scopeId: role.scopeId, type: 'FINE' });
                can('view_author', 'Post', { scopeId: role.scopeId, type: 'WIN' });
                can('view_author', 'Post', { scopeId: role.scopeId, type: 'PAYMENT' });
            });

        roles
            .filter(role => role.role === 'GUEST' && role.scopeType === 'SPACE')
            .forEach(role => cannot('post', 'Scope', { id: role.scopeId }));

        scopeRoles
            .filter(scopeRole => scopeRole.action === 'post')
            .forEach(scopeRole => {
                const userHasCorrectRoleInScope = roles.find(role => scopeRole.scopeId === role.scopeId && scopeRole.roles.includes(role.role));
                if (!userHasCorrectRoleInScope) {
                    cannot('post', 'Post', { scopeId: scopeRole.scopeId, type: scopeRole.type });
                }
            });

        scopeRoles
            .filter(scopeRole => scopeRole.action === 'read')
            .forEach(scopeRole => {
                const userHasCorrectRoleInScope = roles.find(role => scopeRole.scopeId === role.scopeId && scopeRole.roles.includes(role.role));

                if (!userHasCorrectRoleInScope) {
                    cannot('read', 'Post', { scopeId: scopeRole.scopeId, type: scopeRole.type });
                }
            });

        scopeRoles
            .filter(scopeRole => scopeRole.action === 'view_author')
            .forEach(scopeRole => {
                const userHasCorrectRoleInScope = roles.find(role => scopeRole.scopeId === role.scopeId && scopeRole.roles.includes(role.role));
                if (!userHasCorrectRoleInScope) {
                    cannot('view_author', 'Post', { scopeId: scopeRole.scopeId, type: scopeRole.type });
                }
            });
    });