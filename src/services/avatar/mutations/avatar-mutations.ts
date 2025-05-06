import { ENDPOINTS } from '@/services/endpoints';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buildMutationOptions } from '@/services/utilities';
import { put } from '@/services/network';

type AvatarType = 'USER' | 'SCOPE';

const getEndPoint = (type: AvatarType) => {
  switch (type) {
    case 'USER':
      return ENDPOINTS.avatar.user;
    case 'SCOPE':
      return ENDPOINTS.avatar.scope;
  }
};

export const useUploadAvatar = (type: AvatarType) => {
  const queryClient = useQueryClient();

  const mutateFn = ({ id, avatar }) => {
    const form = new FormData();
    form.append('avatar', avatar);
    const endPoint = `${getEndPoint(type)}/${id}`;
    return put(endPoint, form);
  };

  return useMutation(
    buildMutationOptions(mutateFn, queryClient, [
      [{ queryKey: [type === 'USER' ? 'users' : 'scopes'] }, undefined],
    ])
  );
};
