import { User } from "@prisma/client";
import { canSendEmail } from "./can-send-email";

export const getMembersWithEmailConsent = async (members: User[], event) => {
    const consentedMembers: User[] = [];

    for (let memberIndex = 0; memberIndex < members.length; memberIndex++) {
        const member = members[memberIndex];
        const canSendToMember = await canSendEmail(member.id, event);

        if (canSendToMember && member.email !== null) {
            consentedMembers.push(member);
        }
    }

    return consentedMembers;
};