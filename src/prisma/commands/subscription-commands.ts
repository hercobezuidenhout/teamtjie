import { prisma } from '../prisma';
import { SubscriptionStatus, TransactionType } from '@prisma/client';

export interface CreateSubscriptionData {
    userId: string;
    reference: string;
    amount: number;
    currency: string;
    billingCycle: string;
    subscriptionType?: string;
}

export async function createSubscription(data: CreateSubscriptionData) {
    return prisma.subscription.create({
        data: {
            userId: data.userId,
            reference: data.reference,
            amount: data.amount,
            currency: data.currency,
            billingCycle: data.billingCycle,
            subscriptionType: data.subscriptionType || 'TEAMTJIE_PLUS',
            subscribedBy: data.userId,
            status: SubscriptionStatus.PENDING,
        },
    });
}

export interface ActivateSubscriptionData {
    subscriptionId: number;
    externalCustomerId?: string;
    externalSubscriptionId?: string;
    periodStart: Date;
    periodEnd: Date;
}

export async function activateSubscription(data: ActivateSubscriptionData) {
    return prisma.subscription.update({
        where: { id: data.subscriptionId },
        data: {
            status: SubscriptionStatus.ACTIVE,
            externalCustomerId: data.externalCustomerId,
            externalSubscriptionId: data.externalSubscriptionId,
            currentPeriodStart: data.periodStart,
            currentPeriodEnd: data.periodEnd,
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

export async function resetCancellationFlag(subscriptionId: number) {
    return prisma.subscription.update({
        where: { id: subscriptionId },
        data: { cancelAtPeriodEnd: false },
    });
}

export interface CreateTransactionData {
    subscriptionId: number;
    type: TransactionType;
    amount: number;
    currency: string;
    externalPaymentId?: string;
    externalMetadata?: Record<string, unknown>;
    processedAt?: Date;
}

export async function createSubscriptionTransaction(data: CreateTransactionData) {
    return prisma.subscriptionTransaction.create({
        data: {
            subscriptionId: data.subscriptionId,
            type: data.type,
            amount: data.amount,
            currency: data.currency,
            externalPaymentId: data.externalPaymentId,
            externalMetadata: data.externalMetadata,
            processedAt: data.processedAt,
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

// ============================================================================
// Team Management
// ============================================================================

export interface AddTeamToSubscriptionData {
    subscriptionId: number;
    scopeId: number;
    addedBy: string;
}

export async function addTeamToSubscription(data: AddTeamToSubscriptionData) {
    return prisma.subscriptionScope.create({
        data: {
            subscriptionId: data.subscriptionId,
            scopeId: data.scopeId,
            addedBy: data.addedBy,
        },
    });
}

export async function removeTeamFromSubscription(subscriptionId: number, scopeId: number) {
    // Since scopeId is unique, we can delete by scopeId alone
    return prisma.subscriptionScope.delete({
        where: {
            scopeId,
        },
    });
}