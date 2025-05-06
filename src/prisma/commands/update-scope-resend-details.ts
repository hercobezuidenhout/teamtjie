import { ScopeResendDetails } from "@prisma/client";
import prisma from "../prisma";

export const updateScopeResendDetails = async (scopeId: number, details: ScopeResendDetails) =>
    prisma.scopeResendDetails.upsert({
        where: { scopeId },
        update: {
            ...details
        },
        create: {
            ...details,
            scopeId: scopeId,
        }
    });