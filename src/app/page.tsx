import { getGoals, getTeams } from '@/lib/actions';
import GoalTracker from '@/components/GoalTracker';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let goals: import('@/lib/types').Goal[] = [];
  let teams: string[] = [];

  try {
    [goals, teams] = await Promise.all([getGoals(), getTeams()]);
  } catch (err) {
    console.error('DB not connected yet:', err);
  }

  return <GoalTracker initialGoals={goals} initialTeams={teams} />;
}
