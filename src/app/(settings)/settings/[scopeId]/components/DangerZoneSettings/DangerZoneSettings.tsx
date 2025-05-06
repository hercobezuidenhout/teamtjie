'use client';

import { Can } from "@/lib/casl/Can";
import { SettingsItem } from "@/lib/templates/SettingsTemplate/SettingsItem";
import { SettingsTemplate } from "@/lib/templates/SettingsTemplate/SettingsTemplate";
import { subject } from "@casl/ability";
import { Scope } from "@prisma/client";
import { FiLogOut, FiTrash } from "react-icons/fi";

interface DangerZoneSettingsProps {
    scope: Scope;
}

export const DangerZoneSettings = ({ scope }: DangerZoneSettingsProps) => {
    const DELETE_TEAM = `/settings/${scope.id}/delete`;
    const LEAVE_TEAM = `/settings/${scope.id}/leave`;

    return (
        <SettingsTemplate title="Danger Zone">
            <SettingsItem icon={FiLogOut} name="Leave Team" href={LEAVE_TEAM} />
            <Can I="edit" this={subject('Scope', { id: scope.id })}>
                <SettingsItem icon={FiTrash} name="Delete team" href={DELETE_TEAM} />
            </Can>
        </SettingsTemplate>
    );
};