export interface HealthCheckQuestionTemplate {
  title: string;
  description: string;
}

export interface HealthCheckTemplate {
  id: string;
  name: string;
  description: string;
  questions: HealthCheckQuestionTemplate[];
}

export const DEFAULT_TEMPLATE: HealthCheckTemplate = {
  id: 'team-health-v1',
  name: 'Team Health Check',
  description: 'A comprehensive assessment of team health and satisfaction',
  questions: [
    {
      title: 'Communication',
      description: 'How satisfied are you with team communication?'
    },
    {
      title: 'Role Clarity',
      description: 'Do you have clarity on your role and responsibilities?'
    },
    {
      title: 'Collaboration',
      description: 'How would you rate team collaboration?'
    },
    {
      title: 'Leadership Support',
      description: 'Do you feel supported by your team lead?'
    },
    {
      title: 'Workload',
      description: 'How manageable is your current workload?'
    },
    {
      title: 'Work-Life Balance',
      description: 'Are you satisfied with work-life balance?'
    },
    {
      title: 'Goal Alignment',
      description: 'How aligned are you with team goals?'
    },
    {
      title: 'Recognition',
      description: 'Do you feel your contributions are valued?'
    },
    {
      title: 'Psychological Safety',
      description: 'How comfortable are you sharing feedback?'
    },
    {
      title: 'Overall Health',
      description: 'Overall, how healthy does the team feel?'
    }
  ]
};

// Future: Add more templates here
// export const SPRINT_RETRO_TEMPLATE: HealthCheckTemplate = { ... }
// export const QUARTERLY_CHECK_TEMPLATE: HealthCheckTemplate = { ... }

export const TEMPLATES: HealthCheckTemplate[] = [
  DEFAULT_TEMPLATE,
  // Future templates will be added here
];

export const getTemplateById = (id: string): HealthCheckTemplate | undefined => {
  return TEMPLATES.find(template => template.id === id);
};
