import { PostChartData } from "@/models/types/post-chart-data";
import { ENDPOINTS } from "@/services/endpoints";
import { get } from "@/services/network";
import { useQuery } from "@tanstack/react-query";

export const useAppUsageInsightsQuery = (scopeId: number) => {


    return useQuery({
        queryFn: () => get<PostChartData[]>(`${ENDPOINTS.insights.base}/app-usage`, { headers: { 'X-Scope-Id': String(scopeId) } }),
        queryKey: ['insights', 'app-usage', scopeId]
    });
};