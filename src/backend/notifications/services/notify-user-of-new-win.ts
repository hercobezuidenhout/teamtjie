import { Post } from '@prisma/client';
import { sendEmail } from './send-email';
import { getScopeWithUsers } from '@/prisma/queries/get-scope-with-users';
import { canSendEmail } from '../utils/can-send-email';
import { NOTIFICATIONS } from '../notifications';
import { UserWinTemplate } from '@/lib/emails/user-win-template';

export const notifyUserOfNewWin = async (win: Post) => {
  if (!win.scopeId) {
    throw Error('No id was attached to the win.');
  }

  const scope = await getScopeWithUsers(win.scopeId);

  const issuedTo = scope?.roles.find(role => role.user.id === win.issuedToId);

  const link = scope ? `https://Teamtjie.app/spaces/${scope.id}` : 'https://Teamtjie.app';


  if (!issuedTo?.user.email) return;

  const canSend = await canSendEmail(issuedTo?.user.id, NOTIFICATIONS.NOTIFY_USER_OF_NEW_WIN);

  console.log(issuedTo?.user.id, NOTIFICATIONS.NOTIFY_USER_OF_NEW_WIN, canSend);

  if (canSend && scope) {
    sendEmail({
      scopeId: scope.id,
      recipients: [issuedTo?.user.email],
      subject: "🎉 Horray! You got a win!",
      template: UserWinTemplate({ description: win.description, link: link })
    });
  }
};
