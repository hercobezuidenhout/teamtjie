import { useMutation } from '@tanstack/react-query';
import { get } from '@/services/network';

interface ManagementLinkResponse {
  success: boolean;
  link?: string;
  message?: string;
  error?: string;
}

export const useGetManagementLinkMutation = () => {
  return useMutation({
    mutationFn: () =>
      get<ManagementLinkResponse>('/api/v1/billing/subscriptions/management-link'),
  });
};
