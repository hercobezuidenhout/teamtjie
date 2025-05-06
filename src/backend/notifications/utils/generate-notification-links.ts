export const generateNotificationLinks = (endpoint: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const link = `${baseUrl}${endpoint}`;

  return { link };
};
