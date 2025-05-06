'use client';

import { Text, HStack, useCheckboxGroup, useToast } from "@chakra-ui/react";
import { PostPermissionCheckbox } from "./PostPermissionCheckbox";
import { PostType, RoleType, ScopePostPermissionAction } from "@prisma/client";
import { useCreateScopePostPermissionRoleMutation } from "@/services/scope/mutations/use-create-scope-post-permission-role-mutation";
import { useRemoveScopePostPermissionRoleMutation } from "@/services/scope/mutations/use-remove-scope-post-permission-role-mutation";
import { ScopePostPermission } from "@/prisma/queries/get-scope-permissions";
import { useState } from "react";

interface ManagePostItemProps {
    scopeId: number;
    action: ScopePostPermissionAction;
    type: PostType;
    label: string;
    roles?: ScopePostPermission[] | undefined;
    isLoading?: boolean;
}

export const ManagePostItem = ({ label, roles, scopeId, action, type }: ManagePostItemProps) => {
    const postRoles = roles?.map(role => role.roles).flat();
    const { getCheckboxProps } = useCheckboxGroup({ defaultValue: postRoles, value: postRoles });
    const { mutateAsync: addRole, isPending: isAdding } = useCreateScopePostPermissionRoleMutation(scopeId);
    const { mutateAsync: removeRole, isPending: isRemoving } = useRemoveScopePostPermissionRoleMutation(scopeId);
    const [clickedRole, setClickedRole] = useState('');

    const toast = useToast();

    const handleChange = async (role: RoleType, checked: boolean) => {
        setClickedRole(role);
        const scopePostPermissionId = roles?.find(role => role.action === action && role.type === type)?.scopePostPermissionId;

        if (!scopePostPermissionId) return;

        if (checked) {
            await addRole({ role, scopePostPermissionId });

            toast({
                title: `${role} has been added`,
                description: `${role}'s will now be able to ${action} ${type.toLocaleLowerCase()}s`,
                variant: 'success',
                duration: 2000,
                icon: '🤘'
            });
        } else {
            await removeRole({ role, scopePostPermissionId });

            toast({
                title: `${role} has been removed`,
                description: `${role}'s will not be able to ${action} ${type.toLocaleLowerCase()}s`,
                variant: 'success',
                duration: 2000,
                icon: '🤘'
            });
        }

        setClickedRole('');
    };

    return (
        <HStack justifyContent="space-between">
            <Text size="sm">{label}</Text>
            <HStack justifyContent="space-evenly">
                <PostPermissionCheckbox isLoading={(isAdding || isRemoving) && clickedRole === 'ADMIN'} {...getCheckboxProps({ value: 'ADMIN' })} onChange={(event) => handleChange('ADMIN', event.target.checked)}>Admins</PostPermissionCheckbox>
                <PostPermissionCheckbox isLoading={(isAdding || isRemoving) && clickedRole === 'MEMBER'} {...getCheckboxProps({ value: 'MEMBER' })} onChange={(event) => handleChange('MEMBER', event.target.checked)}>Members</PostPermissionCheckbox>
                <PostPermissionCheckbox isLoading={(isAdding || isRemoving) && clickedRole === 'GUEST'} {...getCheckboxProps({ value: 'GUEST' })} onChange={(event) => handleChange('GUEST', event.target.checked)}>Guests</PostPermissionCheckbox>
            </HStack>
        </HStack>
    );
};