'use client';

import { SettingsItem } from "@/lib/templates/SettingsTemplate/SettingsItem";
import { SettingsTemplate } from "@/lib/templates/SettingsTemplate/SettingsTemplate";
import { FiXCircle } from "react-icons/fi";

export const DangerZoneSettings = () => (
    <SettingsTemplate title="Danger Zone">
        <SettingsItem icon={FiXCircle} name="Deactivate Account" href="/me/deactivate" />
    </SettingsTemplate>
);