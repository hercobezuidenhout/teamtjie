import { QueryFiltersFactory } from '@/services/utilities';

export const getUserFineFiltersFactory: <T>(
  getUserId: (payload: T) => string
) => QueryFiltersFactory<T> = (getUserId) => {
  return (payload) => ({
    queryKey: ['users', getUserId(payload), 'received', 'fines'],
  });
};

export const getSpaceFineFiltersFactory: <T>(
  getSpaceId: (payload: T) => number | undefined
) => QueryFiltersFactory<T> = (getSpaceId) => {
  return (payload) => ({
    queryKey: ['spaces', getSpaceId(payload), 'fines'],
  });
};

export const getTeamFineFiltersFactory: <T>(
  getTeamId: (payload: T) => number | undefined
) => QueryFiltersFactory<T> = (getTeamId) => {
  return (payload) => ({
    queryKey: ['teams', getTeamId(payload), 'fines'],
  });
};

export const getEventsFiltersFactory: <T>() => QueryFiltersFactory<T> = () => {
  return (_) => ({
    queryKey: ['events'],
  });
};
