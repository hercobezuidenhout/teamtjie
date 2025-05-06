import { getSession } from "@/app/utils";
import { VStackStretch } from "@/lib/layout/VStackStretch";
import { getUserWithRoles } from "@/prisma";
import { notFound } from "next/navigation";
import { EditProfileSettings } from "./components/EditProfileSettings/EditProfileSettings";
import { BackToAccountButton } from "../components/BackToAccountButton/BackToAccountButton";

const Page = async () => {
    const session = await getSession();

    if (!session || !session.user) {
        notFound();
    }

    const user = await getUserWithRoles(session?.user.id);

    return (
        <VStackStretch>
            <BackToAccountButton />
            <EditProfileSettings user={user} />
        </VStackStretch>
    );
};

export default Page;