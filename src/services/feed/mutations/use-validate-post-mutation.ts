
import { useMutation } from '@tanstack/react-query';
import { post } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';
import { ValidatablePost } from '@/models/types/validatable-post';

export const useValidatePostMutation = () => {

  return useMutation({
    mutationFn:(validatablePost: ValidatablePost) => post<ValidatablePost>(`${ENDPOINTS.feed.base}/validate`, validatablePost)
  })
};
