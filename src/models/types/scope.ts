export type ScopeType = 'SPACE' | 'TEAM';

export interface Scope {
  scopeType: ScopeType;
  scopeId: number;
}
