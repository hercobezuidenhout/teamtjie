export const ENDPOINTS = {
  featureFlags: {
    base: '/api/feature-flags',
  },
  invitations: {
    base: '/api/invitations',
  },
  scopes: {
    base: '/api/scopes',
  },
  avatar: {
    base: '/api/avatars',
    scope: '/api/avatars/scope',
    user: '/api/avatars/user',
  },
  user: {
    base: '/api/users',
    current: '/api/users/current'
  },
  feed: {
    base: '/api/feed'
  },
  permissions: {
    base: '/api/permissions'
  },
  insights: {
    base: '/api/insights'
  }
};
