'use client';

import { useDialog } from "@/contexts/DialogProvider";
import { useRemoveScopeRoleMutation } from "@/services/scope/mutations/use-delete-scope-role-mutation";
import { useUpdateScopeRoleMutation } from "@/services/scope/mutations/use-update-scope-role-mutation";
import { useUserScopeRoleQuery } from "@/services/user/queries/use-user-scope-role-query";
import { HStack, Avatar, VStack, Heading, IconButton, Icon, Text, Select, useToast } from "@chakra-ui/react";
import { Scope, User } from "@prisma/client";
import { FiLock, FiStar, FiTrash, FiUser } from "react-icons/fi";

interface MemberListItemProps {
    member: User;
    scope: Scope;
    filter?: string;
}

export const MemberListItem = ({ member, scope, filter }: MemberListItemProps) => {
    const { data: scopeRole } = useUserScopeRoleQuery(member.id, scope.id);
    const toast = useToast();
    const { mutateAsync: updateRole } = useUpdateScopeRoleMutation(scope.id, ['users', member.id, 'roles', scope.id]);
    const { notify } = useDialog();

    const { mutateAsync: removeScopeRole } = useRemoveScopeRoleMutation(scope.id, [
        'users',
        scope.type,
        scope.id,
        filter,
    ]);

    const handleRoleChange = async (newRole) => {
        try {
            await updateRole({
                currentRole: scopeRole?.role || 'MEMBER',
                newRole: newRole,
                userId: member.id
            });

            toast({
                duration: 2000,
                position: 'bottom-left',
                description: `Successfully updated role.`,
                status: 'success',
            });
        } catch (error) {
            toast({
                duration: 2000,
                position: 'bottom-left',
                description: `Something went wrong.`,
                status: 'error',
            });
        }
    };

    const removeRole = async () => {
        try {
            if (!scopeRole?.role) {
                toast({
                    duration: 2000,
                    position: 'bottom-left',
                    description: `Something went wrong.`,
                    status: 'error',
                });
                return;
            }

            await removeScopeRole({
                role: scopeRole?.role,
                userId: member.id,
            });

            toast({
                duration: 2000,
                position: 'bottom-left',
                description: `Successfully removed user.`,
                status: 'success',
            });
        } catch (error) {
            toast({
                duration: 2000,
                position: 'bottom-left',
                description: `Something went wrong.`,
                status: 'error',
            });
        }
    };

    const handleMemberRemoveClick = () => {
        notify({
            title: 'Remove Member',
            message: `Are you sure you want to remove ${member.name} from the team?`,
            callback: removeRole,
        });
    };

    const determineIcon = () => {
        switch (scopeRole?.role) {
            case 'ADMIN':
                return FiStar;
            case 'GUEST':
                return FiLock;
            default:
                return FiUser;
        }
    };

    return (
        <HStack justifyContent="space-between" pr={3}>
            <HStack gap={3}>
                <Avatar size={{ base: 'sm', md: 'md' }} name={member.name} src={member.image || ''} />
                <VStack alignItems="stretch" gap={0}>
                    <Heading size="sm">{member.name}</Heading>
                    <Text fontSize={{ base: 'xs', md: 'md' }} color="chakra-subtle-text">{member.email}</Text>
                </VStack>
            </HStack>
            <HStack>
                <Select
                    variant="filled"
                    backgroundColor="chakra-subtle-bg"
                    size="sm"
                    borderRadius="md"
                    icon={<Icon as={determineIcon()} />}
                    value={scopeRole?.role}
                    onChange={(event) => handleRoleChange(event.target.value)}>
                    <option>GUEST</option>
                    <option>MEMBER</option>
                    <option>ADMIN</option>
                </Select>
                <IconButton display={{ base: 'none', md: 'block' }} aria-label="Remove Member" icon={<Icon as={FiTrash} />} onClick={handleMemberRemoveClick} />
            </HStack>
        </HStack>
    );
};