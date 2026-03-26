import { pgTable, uuid, text, date, integer, timestamp, index } from 'drizzle-orm/pg-core';

export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  level: text('level').notNull(),
  name: text('name').notNull(),
  parentId: uuid('parent_id'),
  owner: text('owner'),
  team: text('team'),
  targetDate: date('target_date'),
  status: text('status').notNull().default('not_started'),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('goals_level_idx').on(table.level),
  index('goals_parent_idx').on(table.parentId),
  index('goals_status_idx').on(table.status),
  index('goals_team_idx').on(table.team),
]);

export type GoalRecord = typeof goals.$inferSelect;
export type NewGoalRecord = typeof goals.$inferInsert;
