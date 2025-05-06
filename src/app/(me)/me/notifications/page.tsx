import { VStackStretch } from "@/lib/layout/VStackStretch";
import { BackToAccountButton } from "../components/BackToAccountButton/BackToAccountButton";
import { UserNotificationPreferences } from "./components/UserNotificationPreferences";
import { getSession } from "@/app/utils";
import { notFound } from "next/navigation";
import { getUserWithRoles } from "@/prisma";

const Page = async () => {
    const session = await getSession();

    if (!session || !session.user) {
        notFound();
    }

    const user = await getUserWithRoles(session?.user.id);

    return (
        <>
            <VStackStretch gap={2}>
                <BackToAccountButton />
                <UserNotificationPreferences user={user} />
            </VStackStretch>
        </>
    );
};

export default Page;