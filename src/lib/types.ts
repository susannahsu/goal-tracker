export type Status = 'not_started' | 'on_track' | 'at_risk' | 'behind' | 'completed' | 'n_a';
export type Level = 'mission' | 'why_this_strategy' | 'strategic_position' | 'strategic_pillar' | 'team_goal';

export interface Goal {
  id: string;
  level: Level;
  name: string;
  parentId: string | null;
  owner: string | null;
  team: string | null;
  targetDate: string | null;
  status: Status;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const LEVEL_ORDER: Level[] = [
  'mission',
  'why_this_strategy',
  'strategic_position',
  'strategic_pillar',
  'team_goal',
];

export const LEVEL_LABELS: Record<Level, string> = {
  mission: 'Mission',
  why_this_strategy: 'Why This Strategy',
  strategic_position: 'Strategic Position',
  strategic_pillar: 'Strategic Pillar',
  team_goal: 'Team Goal',
};

export const LEVEL_DISPLAY: Record<Level, string> = {
  mission: 'MISSION',
  why_this_strategy: 'WHY THIS STRATEGY',
  strategic_position: 'STRATEGIC POSITION',
  strategic_pillar: 'STRATEGIC PILLAR',
  team_goal: 'TEAM GOAL',
};

export const STATUS_LABELS: Record<Status, string> = {
  not_started: 'Not Started',
  on_track: 'On Track',
  at_risk: 'At Risk',
  behind: 'Behind',
  completed: 'Completed',
  n_a: 'N/A',
};

export const STRATEGY_LEVELS: Level[] = [
  'mission',
  'why_this_strategy',
  'strategic_position',
  'strategic_pillar',
];
