export interface SentimentInsight {
  date: Date;
  average: number | null;
  count: number;
}

export interface HealthCheckQuestionScore {
  title: string;
  description: string;
  average: number | null;
  responseCount: number;
}

export interface HealthCheckInsight {
  id: number;
  createdAt: Date;
  totalResponses: number;
  questions: HealthCheckQuestionScore[];
}

export interface ValueDistribution {
  name: string;
  count: number;
}

export interface PostOverTime {
  date: string;
  count: number;
}

export interface CultureInsight {
  totalPosts: number;
  valueDistribution: ValueDistribution[];
  postsOverTime: PostOverTime[];
}
