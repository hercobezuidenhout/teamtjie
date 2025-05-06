export interface AzureToken {
  aud: string;
  exp: number;
  sub: string;
  email: string;
  phone: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    provider_id: string;
    sub: string;
  };
  role: string;
  aal: string;
  amr: {
    method: string;
    timestamp: number;
  }[];
  session_id: string;
}
