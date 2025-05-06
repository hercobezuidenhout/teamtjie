'use client';

import { FiBell, FiGlobe, FiMail } from "react-icons/fi";
import { SettingsItem } from "@/lib/templates/SettingsTemplate/SettingsItem";
import { SettingsTemplate } from "@/lib/templates/SettingsTemplate/SettingsTemplate";

export const AccountSettings = () => {

    return (
        <SettingsTemplate title="Account">
            <SettingsItem icon={FiMail} name="Change Email" href="/me/email" />
            <SettingsItem icon={FiGlobe} name="Manage Providers" href="/me/providers" />
            <SettingsItem icon={FiBell} name="Notification Preferences" href="/me/notifications" />
        </SettingsTemplate>
    );
};