import { getDeactivatedUserByEmail } from '@/prisma/queries/get-deactivated-user-by-email';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (email) {
        const deactivatedUser = await getDeactivatedUserByEmail(email);
        return NextResponse.json(deactivatedUser);
    } else {
        return NextResponse.json(false);
    }
}