import client from '@sendgrid/client';

export const createSendgridContact = async (email: string) => {
    client.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY!);

    const data = {
        contacts: [
            {
                email: email,
            }
        ]
    };

    await client.request({
        url: '/v3/marketing/contacts',
        body: data,
        method: 'PUT'
    });
};