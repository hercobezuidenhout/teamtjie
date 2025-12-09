'use client';

import { SettingsItem } from "@/lib/templates/SettingsTemplate/SettingsItem";
import { SettingsTemplate } from "@/lib/templates/SettingsTemplate/SettingsTemplate";
import { Scope } from "@prisma/client";
import { FiCreditCard } from "react-icons/fi";

interface BillingSettingsProps {
    scope: Scope;
}

export function BillingSettings({ scope }: BillingSettingsProps) {
    const BILLING_PAGE = `/settings/${scope.id}/billing`;

    return (
        <SettingsTemplate title="Billing & Subscription">
            <SettingsItem href={BILLING_PAGE} name="View Billing" icon={FiCreditCard} />
        </SettingsTemplate>
    );
}