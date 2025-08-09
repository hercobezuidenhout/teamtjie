import { Post } from '@prisma/client';
import { sendEmail } from './send-email';
import { getScopeWithUsers } from '@/prisma/queries/get-scope-with-users';
import { getMembersWithEmailConsent } from '../utils/get-members-with-email-consent';
import { NOTIFICATIONS } from '../notifications';
import { ScopeWinTemplate } from '@/lib/emails/scope-win-template';

export const notifyScopeOfNewWin = async (win: Post) => {
    if (!win.scopeId) {
        throw Error('No team id was attached to the fine.');
    }

    const scope = await getScopeWithUsers(win.scopeId);
    const scopeMembers = scope?.roles.map((role) => role.user);

    const issuedToName = scopeMembers?.find(
        (member) => member.id == win.issuedToId
    )?.name;

    if (!scopeMembers) return;

    const consentedMembers = await getMembersWithEmailConsent(scopeMembers, NOTIFICATIONS.NOTIFY_SCOPE_OF_NEW_WIN);

    const recipients = consentedMembers
        ?.filter(
            (member) => member.id !== win.issuedById && member.id !== win.issuedToId && member.email
        )
        ?.map((member) => member.email);

    const link = scope ? `https://Teamtjie.app/spaces/${scope.id}` : `https://Teamtjie.app`;

    const subject = `🎉 ${issuedToName} has been awared a win!`;

    if (recipients && scope) {
        sendEmail({
            scopeId: scope.id,
            recipients: recipients.filter(recipient => recipient !== null),
            subject: subject,
            template: ScopeWinTemplate({
                who: issuedToName || 'Someone',
                description: win.description,
                link: link
            })
        });
    }

    return;
};
