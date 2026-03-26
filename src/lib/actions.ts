'use server';

import { revalidatePath } from 'next/cache';
import { db } from './db';
import { goals } from './schema';
import { eq, asc } from 'drizzle-orm';
import type { Goal, Level, Status } from './types';

function serialize(record: Record<string, unknown>): Goal {
  return {
    id: record.id as string,
    level: record.level as Level,
    name: record.name as string,
    parentId: record.parentId as string | null,
    owner: record.owner as string | null,
    team: record.team as string | null,
    targetDate: record.targetDate as string | null,
    status: record.status as Status,
    sortOrder: record.sortOrder as number,
    createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : String(record.createdAt),
    updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : String(record.updatedAt),
  };
}

export async function getGoals(): Promise<Goal[]> {
  const rows = await db.select().from(goals).orderBy(asc(goals.sortOrder), asc(goals.createdAt));
  return rows.map(serialize);
}

export async function createGoal(data: {
  level: Level;
  name: string;
  parentId?: string | null;
  owner?: string | null;
  team?: string | null;
  targetDate?: string | null;
  status: Status;
}): Promise<Goal> {
  const [row] = await db.insert(goals).values({
    level: data.level,
    name: data.name,
    parentId: data.parentId ?? null,
    owner: data.owner ?? null,
    team: data.team ?? null,
    targetDate: data.targetDate ?? null,
    status: data.status,
    sortOrder: Date.now(),
  }).returning();

  revalidatePath('/');
  return serialize(row as Record<string, unknown>);
}

export async function updateGoal(id: string, data: {
  name?: string;
  parentId?: string | null;
  owner?: string | null;
  team?: string | null;
  targetDate?: string | null;
  status?: Status;
}): Promise<Goal> {
  const [row] = await db.update(goals)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(goals.id, id))
    .returning();

  revalidatePath('/');
  return serialize(row as Record<string, unknown>);
}

export async function deleteGoal(id: string): Promise<void> {
  // Unlink children before deleting
  await db.update(goals).set({ parentId: null }).where(eq(goals.parentId, id));
  await db.delete(goals).where(eq(goals.id, id));
  revalidatePath('/');
}

export async function getTeams(): Promise<string[]> {
  const rows = await db.select({ team: goals.team }).from(goals);
  const teams = [...new Set(rows.map((r) => r.team).filter(Boolean) as string[])];
  return teams.sort();
}
