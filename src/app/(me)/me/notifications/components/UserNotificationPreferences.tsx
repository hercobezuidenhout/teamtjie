'use client';

import { VStack, Heading, Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/react";
import { NotificationPreferenceItem } from "./NotificationPreferenceItem";
import { UserWithRolesDto } from "@/prisma";
import { useUserNotificationPreferencesQuery } from "@/services/user/queries/use-user-notification-preferences-query";
import { NOTIFICATIONS } from "@/backend";
import { NotificationType } from "@prisma/client";

interface UserNotificationPreferencesProps {
    user: UserWithRolesDto;
}

export const UserNotificationPreferences = ({ user }: UserNotificationPreferencesProps) => {
    const { data: preferences } = useUserNotificationPreferencesQuery(user.id);

    const getPreferences = (event: string) => {
        const userPreferences: NotificationType[] = [];
        const filteredPreferences = preferences?.filter(preference => preference.event === event);

        const emailPreference = filteredPreferences?.find(preference => preference.type === 'EMAIL');
        if (!emailPreference) {
            userPreferences.push(NotificationType.EMAIL);
        } else {
            if (emailPreference.enabled) {
                userPreferences.push(NotificationType.EMAIL);
            }
        }

        return userPreferences;
    };

    return (
        <Card>
            <CardHeader>
                <Heading>Notification Preferences</Heading>
            </CardHeader>
            <CardBody py={0}>
                <VStack alignItems="stretch" gap={5}>
                    <VStack alignItems="stretch">
                        <Heading size="sm">Posts</Heading>
                        <VStack gap={3} alignItems="stretch">
                            <NotificationPreferenceItem event={NOTIFICATIONS.NOTIFY_USER_OF_NEW_WIN} userId={user.id} label="When you are given a win" preferences={getPreferences(NOTIFICATIONS.NOTIFY_USER_OF_NEW_WIN)} />
                            <NotificationPreferenceItem event={NOTIFICATIONS.NOTIFY_USER_OF_NEW_FINE} userId={user.id} label="When you are given a fine" preferences={getPreferences(NOTIFICATIONS.NOTIFY_USER_OF_NEW_FINE)} />
                            <NotificationPreferenceItem event={NOTIFICATIONS.NOTIFY_SCOPE_OF_NEW_FINE} userId={user.id} label="When someone in the team is given a fine" preferences={getPreferences(NOTIFICATIONS.NOTIFY_SCOPE_OF_NEW_FINE)} />
                            <NotificationPreferenceItem event={NOTIFICATIONS.NOTIFY_SCOPE_OF_NEW_WIN} userId={user.id} label="When someone in the team is given a win" preferences={getPreferences(NOTIFICATIONS.NOTIFY_SCOPE_OF_NEW_WIN)} />
                        </VStack>
                    </VStack>
                </VStack>
            </CardBody>
            <CardFooter />
        </Card>
    );
};