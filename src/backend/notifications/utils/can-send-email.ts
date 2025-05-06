import { getUserEmailPreferences } from "@/prisma/queries/get-user-email-preferences";

export const canSendEmail = async (userId: string, event: string) => {
    const userEmailPreferences = await getUserEmailPreferences(userId);
    const userEmailPreference = userEmailPreferences.find(preference => preference.event === event);

    if (!userEmailPreference) {
        return true;
    }

    return userEmailPreference.enabled;
};