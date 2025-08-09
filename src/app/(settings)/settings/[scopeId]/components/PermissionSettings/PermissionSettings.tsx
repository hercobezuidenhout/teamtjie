'use client';

import { Can } from "@/lib/casl/Can";
import { SettingsItem } from "@/lib/templates/SettingsTemplate/SettingsItem";
import { SettingsTemplate } from "@/lib/templates/SettingsTemplate/SettingsTemplate";
import { subject } from "@casl/ability";
import { Scope } from "@prisma/client";
import { FiEdit } from "react-icons/fi";

interface PermissionSettingsProps {
    scope: Scope;
}

export const PermissionSettings = ({ scope }: PermissionSettingsProps) => {
    const MANAGE_POSTS = `/settings/${scope.id}/posts`;

    return (
        <Can I="edit" this={subject('Scope', { id: scope.id })}>
            <SettingsTemplate title="Manage Posts">
                <SettingsItem href={MANAGE_POSTS} icon={FiEdit} name="Manage post permissions" />
            </SettingsTemplate>
        </Can>
    );
};