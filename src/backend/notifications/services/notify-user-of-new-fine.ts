import { Post } from '@prisma/client';
import { generateNotificationLinks } from '../utils/generate-notification-links';
import { getScope } from '@/prisma';
import { getScopeWithUsers } from '@/prisma/queries/get-scope-with-users';
import { sendEmail } from './send-email';
import { canSendEmail } from '../utils/can-send-email';
import { NOTIFICATIONS } from '../notifications';
import { UserFineTemplate } from '@/lib/emails/user-fine-template';

export const notifyUserOfNewFine = async (fine: Post) => {
  if (!fine.scopeId) {
    throw Error('No id was attached to the fine.');
  }

  const team = await getScopeWithUsers(fine.scopeId);
  const teamMembers = team?.roles.map((role) => role.user);

  const issuedTo = teamMembers?.find(
    (member) => member.id == fine.issuedToId
  );

  const scope = await getScope(fine.scopeId);
  const endpoint = `/spaces/${scope.id}`;

  const { link } = generateNotificationLinks(endpoint);


  const subject = "🚨 You have been fined!";

  if (!issuedTo?.email) return;

  const canSend = await canSendEmail(issuedTo?.id, NOTIFICATIONS.NOTIFY_USER_OF_NEW_FINE);

  if (canSend && scope) {
    const email = sendEmail({
      scopeId: scope.id,
      recipients: [issuedTo?.email],
      subject: subject,
      template: UserFineTemplate({
        description: fine.description,
        link: link
      })
    });

    return email;
  }
};
