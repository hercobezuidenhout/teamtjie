import { generatePostUsageInsights } from "@/services/insights/service/insights";
import { addDays, startOfWeek } from "date-fns";
import { BadRequestException, createHandler, Get, Header, Query } from "next-api-decorators";

class InsightsHandler {
    @Get('/app-usage')
    async getAppUsage(
        @Header('X-Scope-Id') scopeId: number,
        @Query('startDate') startDateFromQuery: Date,
        @Query('endDate') endDateFromQuery: Date
    ) {
        if (!scopeId) {
            throw new BadRequestException();
        }

        const startDate = startDateFromQuery ? startDateFromQuery : startOfWeek(new Date(), { weekStartsOn: 2 });
        const endDate = endDateFromQuery ? endDateFromQuery : addDays(startDate, 6);

        console.log(startDate, endDate);

        const postUsage = await generatePostUsageInsights(scopeId, startDate, endDate);

        return postUsage;
    }

}

export default createHandler(InsightsHandler);