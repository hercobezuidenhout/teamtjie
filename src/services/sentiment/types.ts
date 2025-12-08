export interface DailySentiment {
  id: number;
  userId: string;
  scopeId: number;
  date: Date;
  sentiment: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SentimentAverage {
  average: number | null;
  count: number;
  date: Date;
}

export interface ScopeSettings {
  id: number;
  scopeId: number;
  showAverageSentiment: boolean;
}

export interface CreateSentimentDto {
  scopeId: number;
  sentiment: number;
  note?: string;
}
