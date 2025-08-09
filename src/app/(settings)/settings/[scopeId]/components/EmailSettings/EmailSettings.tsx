'use client';

import { Can } from "@/lib/casl/Can";
import { SettingsItem } from "@/lib/templates/SettingsTemplate/SettingsItem";
import { SettingsTemplate } from "@/lib/templates/SettingsTemplate/SettingsTemplate";
import { subject } from "@casl/ability";
import { Link, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { FiMail } from "react-icons/fi";

interface EmailSettingsProps {
    scope: Scope;
}

export const EmailSettings = ({ scope }: EmailSettingsProps) => {
    const generateMailtoLink = () => {
        const recipient = process.env.NEXT_PUBLIC_SUPPORT_RECIPIENT;
        const subject = 'Configure Resend Details Request';
        const body = `Hey 👋,\n\nCan you please configure the Resend details for my team, ${scope.name}.\n\nTeam ID: ${scope.id}\nResend API Key: <Please add you Resend API key>\nResend Sender Name: <Please add you Resend configured sender name>\nResend Sender Email: <Please add the Resend configured email>`;

        const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        return mailtoLink;
    };

    // Example of using the function
    const link = generateMailtoLink();
    console.log(link); // You can use this link in your HTML or elsewhere


    return (
        <SettingsTemplate title="Email">
            <Text>
                Teamtjie uses <Link href="https://resend.com/home" color="chakra-primary-color">Resend</Link> to send emails.
                For Teamtjie to stay free of charge, <strong>the Resend details need to be supplied by you</strong>.
                To configure the Resend details for your team, reach out to the Teamtjie team.
            </Text>
            <Text>
                Clicking the below button will create a new email with prepopulated details. The following details need to be updated before sending the email.
            </Text>
            <UnorderedList mb={3}>
                <ListItem><Link href="https://resend.com/api-keys" color="chakra-primary-color">Resend API Key</Link></ListItem>
                <ListItem>Resend Sender Name</ListItem>
                <ListItem>Resend Sender Email</ListItem>
            </UnorderedList>

            <Can I="edit" this={subject('Scope', { id: scope.id })}>
                <SettingsItem href={generateMailtoLink()} name="Add Resend Configuration" icon={FiMail} />
            </Can>
        </SettingsTemplate>
    );
};