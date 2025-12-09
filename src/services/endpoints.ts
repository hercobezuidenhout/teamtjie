export const ENDPOINTS = {
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
  },
  billing: {
    base: '/api/v1/billing',
    subscriptions: '/api/v1/billing/subscriptions',
    webhook: '/api/v1/billing/webhook',
  }
};
