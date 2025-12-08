export interface HealthCheckQuestion {
  id: number;
  healthCheckId: number;
  title: string;
  description: string;
  order: number;
}

export interface HealthCheckAnswer {
  id: number;
  responseId: number;
  questionId: number;
  score: number;
  note: string | null;
  question: HealthCheckQuestion;
}

export interface HealthCheckResponse {
  id: number;
  healthCheckId: number;
  userId: string;
  completedAt: Date | null;
  answers: HealthCheckAnswer[];
}

export interface HealthCheck {
  id: number;
  scopeId: number;
  templateId: string;
  createdAt: Date;
  createdBy: string;
  questions: HealthCheckQuestion[];
  responses: HealthCheckResponse[];
  _count?: {
    responses: number;
  };
}

export interface CreateHealthCheckDto {
  scopeId: number;
}

export interface SaveResponseDto {
  healthCheckId: number;
  answers: {
    questionId: number;
    score: number;
    note?: string;
  }[];
  completed: boolean;
}
