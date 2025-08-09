import { getPostUsageForScope } from "@/prisma/queries/get-post-usage-for-scope";

export const generatePostUsageInsights = async (scopeId: number, startDate: Date, endDate: Date) => {
    const postUsage = await getPostUsageForScope(Number(scopeId));

    const dataMap = {};

    postUsage.forEach(entry => {
        const dateKey = entry.date;

        if (!dataMap[dateKey]) {
            dataMap[dateKey] = { date: dateKey, fines: 0, wins: 0, payments: 0 };
        }
        if (entry.type === 'FINE') {
            dataMap[dateKey].fines = entry.count;
        } else if (entry.type === 'WIN') {
            dataMap[dateKey].wins = entry.count;
        } else if (entry.type === 'PAYMENT') {
            dataMap[dateKey].payments = entry.count;
        }
    });

    const dateArray: any = [];
    const currentDate = startDate;

    while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0];
        if (!dataMap[dateKey]) {
            dataMap[dateKey] = { date: dateKey, fines: 0, wins: 0, payments: 0 };
        }
        dateArray.push(dataMap[dateKey]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
};