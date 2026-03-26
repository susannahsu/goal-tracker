'use client';

import { useState, useTransition } from 'react';
import { deleteGoal, updateGoal } from '@/lib/actions';
import type { Goal, Level, Status } from '@/lib/types';
import { LEVEL_DISPLAY, STATUS_LABELS, STRATEGY_LEVELS } from '@/lib/types';
import StatusBadge from './StatusBadge';

interface Props {
  goals: Goal[];
  search: string;
  filterLevel: string;
  filterTeam: string;
  filterStatus: string;
}

function GoalRow({ goal, parentGoal }: { goal: Goal; parentGoal: Goal | undefined }) {
  const [isPending, startTransition] = useTransition();
  const [editingStatus, setEditingStatus] = useState(false);

  function handleDelete() {
    if (!confirm('Delete this goal?')) return;
    startTransition(async () => { await deleteGoal(goal.id); });
  }

  function handleStatusChange(newStatus: Status) {
    setEditingStatus(false);
    startTransition(async () => { await updateGoal(goal.id, { status: newStatus }); });
  }

  const isStrategy = STRATEGY_LEVELS.includes(goal.level as Level);

  return (
    <tr
      className={`border-b border-[#1f1f1f] group transition-colors ${isStrategy ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#161616]'}`}
      style={{ opacity: isPending ? 0.5 : 1 }}
    >
      {/* Level */}
      <td className="py-3 px-4 whitespace-nowrap">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
          {LEVEL_DISPLAY[goal.level as Level]}
        </span>
      </td>

      {/* Goal name */}
      <td className="py-3 px-4 max-w-xs">
        <span className="text-sm text-zinc-200 leading-snug">{goal.name}</span>
      </td>

      {/* Parent */}
      <td className="py-3 px-4 max-w-[180px]">
        {parentGoal ? (
          <span className="text-xs text-zinc-500 truncate block max-w-[180px]" title={parentGoal.name}>
            {parentGoal.name.length > 40 ? parentGoal.name.slice(0, 40) + '…' : parentGoal.name}
          </span>
        ) : (
          <span className="text-xs text-zinc-600">—</span>
        )}
      </td>

      {/* Team */}
      <td className="py-3 px-4 whitespace-nowrap">
        <span className="text-sm text-zinc-400">{goal.team || <span className="text-zinc-600">—</span>}</span>
      </td>

      {/* Owner */}
      <td className="py-3 px-4 whitespace-nowrap">
        <span className="text-sm text-zinc-400">{goal.owner || <span className="text-zinc-600">—</span>}</span>
      </td>

      {/* Date */}
      <td className="py-3 px-4 whitespace-nowrap">
        {goal.targetDate ? (
          <span className="text-sm text-zinc-400">
            {new Date(goal.targetDate + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short', day: '2-digit', year: 'numeric',
            })}
          </span>
        ) : (
          <span className="text-zinc-600 text-sm">—</span>
        )}
      </td>

      {/* Status */}
      <td className="py-3 px-4 whitespace-nowrap">
        {editingStatus ? (
          <select
            autoFocus
            value={goal.status}
            onChange={(e) => handleStatusChange(e.target.value as Status)}
            onBlur={() => setEditingStatus(false)}
            className="bg-[#1a1a1a] border border-[#333] text-zinc-200 text-sm rounded px-2 py-1 focus:outline-none"
          >
            {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        ) : (
          <button
            onClick={() => setEditingStatus(true)}
            className="hover:opacity-80 transition-opacity cursor-pointer"
            title="Click to change status"
          >
            <StatusBadge status={goal.status as Status} />
          </button>
        )}
      </td>

      {/* Delete */}
      <td className="py-3 px-4 w-10">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all"
          title="Delete goal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </td>
    </tr>
  );
}

export default function GoalsTable({ goals, search, filterLevel, filterTeam, filterStatus }: Props) {
  const goalsById = Object.fromEntries(goals.map((g) => [g.id, g]));

  function matches(goal: Goal) {
    const q = search.toLowerCase();
    if (q && !goal.name.toLowerCase().includes(q) && !(goal.owner?.toLowerCase().includes(q)) && !(goal.team?.toLowerCase().includes(q))) return false;
    if (filterLevel && filterLevel !== 'all' && goal.level !== filterLevel) return false;
    if (filterTeam && filterTeam !== 'all' && goal.team !== filterTeam) return false;
    if (filterStatus && filterStatus !== 'all' && goal.status !== filterStatus) return false;
    return true;
  }

  const strategyGoals = goals.filter((g) => STRATEGY_LEVELS.includes(g.level as Level) && matches(g));
  const teamGoals = goals.filter((g) => g.level === 'team_goal' && matches(g));

  const colHeaders = ['LEVEL', 'GOAL', 'PARENT(S)', 'TEAM', 'OWNER', 'DATE', 'STATUS', ''];

  function SectionTable({ rows, label }: { rows: Goal[]; label: string }) {
    if (rows.length === 0) return null;
    return (
      <div>
        <div className="px-4 py-3 border-b border-[#1f1f1f]">
          <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">{label}</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1f1f1f]">
              {colHeaders.map((h) => (
                <th key={h} className="py-2 px-4 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((goal) => (
              <GoalRow key={goal.id} goal={goal} parentGoal={goal.parentId ? goalsById[goal.parentId] : undefined} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const hasResults = strategyGoals.length > 0 || teamGoals.length > 0;

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[900px]">
        {!hasResults ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-600">
            <p className="text-lg">No goals match your filters.</p>
          </div>
        ) : (
          <>
            <SectionTable rows={strategyGoals} label="Strategy" />
            <SectionTable rows={teamGoals} label="Team Goals" />
          </>
        )}
      </div>
    </div>
  );
}
