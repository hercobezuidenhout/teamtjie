import { getScopeResendDetails } from "@/prisma/queries/get-scope-resend-details";
import { Resend } from "resend";

interface Email {
    recipients: string[];
    subject: string;
    template: any;
    scopeId: number;
}

export const sendEmail = async ({ recipients, subject, template, scopeId }: Email) => {
    if (!process.env.SENDMAIL_ENABLED) {
        console.error('process.env.SENDMAIL_ENABLED is missing or disabled.');
        return;
    };

    const resendDetails = await getScopeResendDetails(scopeId);

    if (!resendDetails) {
        console.error("No sender details found for the team.");
        return;
    }

    const resend = new Resend(resendDetails.apiKey);

    const { data, error } = await resend.emails.send({
        from: `${resendDetails.senderName} <${resendDetails.senderEmail}>`,
        to: recipients,
        subject: subject,
        react: template,
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
};