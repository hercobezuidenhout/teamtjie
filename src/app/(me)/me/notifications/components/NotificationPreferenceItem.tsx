'use client';

import { Text, HStack, useCheckboxGroup, useToast } from "@chakra-ui/react";
import { NotificationPreferenceCheckbox } from "./NotificationPreferenceCheckbox";
import { NotificationType } from "@prisma/client";
import { useUpdateUserNotificationPreferenceMutation } from "@/services/user/mutations/use-update-user-notification-preference-mutation";

interface NotificationPreferenceItemProps {
    userId: string;
    label: string;
    event: string;
    preferences: NotificationType[] | undefined;
}

export const NotificationPreferenceItem = ({ label, event, preferences, userId }: NotificationPreferenceItemProps) => {
    const { getCheckboxProps } = useCheckboxGroup({ defaultValue: preferences, value: preferences });
    const { mutateAsync: updatePreference } = useUpdateUserNotificationPreferenceMutation(userId);
    const toast = useToast();

    const handleChange = async (type: NotificationType, checked: boolean, friendlyName: string, id?: number) => {
        await updatePreference({
            enabled: checked,
            event: event,
            type: type,
            id: id
        });

        toast({
            title: `${friendlyName} has been ${checked ? 'enabled' : 'disabled'}.`,
            description: `${friendlyName}'s will now be sent when ${label.toLowerCase()}.`,
            variant: 'success',
            duration: 2000,
            icon: '🤘'
        });
    };

    return (
        <HStack justifyContent="space-between">
            <Text size="sm">{label}</Text>
            <HStack justifyContent="space-evenly">
                <NotificationPreferenceCheckbox {...getCheckboxProps({ value: 'EMAIL' })} onChange={(event) => handleChange('EMAIL', event.target.checked, 'Email')}>Email</NotificationPreferenceCheckbox>
            </HStack>
        </HStack>
    );
};