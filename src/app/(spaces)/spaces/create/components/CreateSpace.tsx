'use client';

import { CreateScopeForm } from "@/lib/forms/CreateScopeForm/CreateScopeForm";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

export const CreateSpace = () => {
    const { push } = useRouter();
    const { auth } = useSupabaseClient();

    const handleLogoutClick = () => auth.signOut().then(() => push('/'));

    return (
        <CreateScopeForm onLogoutClick={handleLogoutClick} type="SPACE" onCancel={() => push('/')} />
    )
}