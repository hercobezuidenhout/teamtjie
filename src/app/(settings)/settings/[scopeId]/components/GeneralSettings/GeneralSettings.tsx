'use client';

import { useAbilities } from "@/contexts/AbilityContextProvider";
import { Can } from "@/lib/casl/Can";
import { SettingsItem } from "@/lib/templates/SettingsTemplate/SettingsItem";
import { SettingsTemplate } from "@/lib/templates/SettingsTemplate/SettingsTemplate";
import { subject } from "@casl/ability";
import { Scope } from "@prisma/client";
import { FiAward, FiUsers } from "react-icons/fi";

interface GeneralSettingsProps {
    scope: Scope;
}

export const GeneralSettings = ({ scope }: GeneralSettingsProps) => {
    const abilities = useAbilities();
    const EDIT_CHARTER = `/spaces/${scope.parentScopeId ?? scope.id}/charters/${scope.id}?isFromSettings=true`;
    const MANAGE_MEMBERS = `/settings/${scope.id}/members`;

    const canEditScope = abilities.can('edit', subject('Scope', { id: scope.id }));
    const EDIT_CHARTER_LABEL = canEditScope ? 'Edit Charter' : 'View Charter';

    return (
        <SettingsTemplate title="General">
            <SettingsItem href={EDIT_CHARTER} name={EDIT_CHARTER_LABEL} icon={FiAward} />
            <Can I="edit" this={subject('Scope', { id: scope.id })}>
                <SettingsItem href={MANAGE_MEMBERS} name="Manage Members" icon={FiUsers} />
            </Can>
        </SettingsTemplate>
    );
};