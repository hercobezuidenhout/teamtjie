import { prisma } from '../prisma';
import { SubscriptionStatus, TransactionType } from '@prisma/client';

export interface CreateSubscriptionData {
    scopeId: number;
    amount: number;
    currency: string;
    billingCycle: string;
    payfastToken?: string;
}

export async function createSubscription(data: CreateSubscriptionData) {
    return prisma.subscription.create({
        data: {
            scopeId: data.scopeId,
            amount: data.amount,
            currency: data.currency,
            billingCycle: data.billingCycle,
            payfastToken: data.payfastToken,
            status: SubscriptionStatus.PENDING,
        },
    });
}

export async function activateSubscription(
    subscriptionId: number,
    payfastSubscriptionId: string,
    periodStart: Date,
    periodEnd: Date
) {
    return prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
            status: SubscriptionStatus.ACTIVE,
            payfastSubscriptionId,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
        },
    });
}

export async function updateSubscriptionStatus(
    subscriptionId: number,
    status: SubscriptionStatus
) {
    return prisma.subscription.update({
        where: { id: subscriptionId },
        data: { status },
    });
}

export async function cancelSubscription(
    subscriptionId: number,
    cancelAtPeriodEnd: boolean = true
) {
    return prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
            cancelAtPeriodEnd,
            status: cancelAtPeriodEnd ? SubscriptionStatus.ACTIVE : SubscriptionStatus.CANCELLED,
        },
    });
}

export async function createSubscriptionTransaction(
    subscriptionId: number,
    type: TransactionType,
    amount: number,
    currency: string,
    payfastPaymentId?: string,
    metadata?: any
) {
    return prisma.subscriptionTransaction.create({
        data: {
            subscriptionId,
            type,
            amount,
            currency,
            payfastPaymentId,
            metadata,
        },
    });
}

export async function updateSubscriptionPeriod(
    subscriptionId: number,
    periodStart: Date,
    periodEnd: Date
) {
    return prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
        },
    });
}