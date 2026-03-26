'use client';

import { useState, useTransition } from 'react';
import { createGoal } from '@/lib/actions';
import type { Goal, Level, Status } from '@/lib/types';
import { LEVEL_LABELS, LEVEL_ORDER, STATUS_LABELS } from '@/lib/types';

interface Props {
  goals: Goal[];
  teams: string[];
  onClose: () => void;
  onTeamAdded: (team: string) => void;
}

const VALID_PARENT_LEVELS: Record<Level, Level[]> = {
  mission: [],
  why_this_strategy: ['mission'],
  strategic_position: ['mission', 'why_this_strategy'],
  strategic_pillar: ['mission', 'why_this_strategy', 'strategic_position'],
  team_goal: ['mission', 'why_this_strategy', 'strategic_position', 'strategic_pillar'],
};

export default function AddGoalModal({ goals, teams, onClose, onTeamAdded }: Props) {
  const [isPending, startTransition] = useTransition();
  const [level, setLevel] = useState<Level>('team_goal');
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [owner, setOwner] = useState('');
  const [team, setTeam] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState<Status>('not_started');
  const [newTeamInput, setNewTeamInput] = useState('');
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [error, setError] = useState('');

  const validParentLevels = VALID_PARENT_LEVELS[level];
  const parentOptions = goals.filter((g) => validParentLevels.includes(g.level));

  function handleAddTeam() {
    const trimmed = newTeamInput.trim();
    if (trimmed && !teams.includes(trimmed)) {
      onTeamAdded(trimmed);
      setTeam(trimmed);
    } else if (trimmed) {
      setTeam(trimmed);
    }
    setNewTeamInput('');
    setShowNewTeam(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Goal name is required.');
      return;
    }
    setError('');

    startTransition(async () => {
      await createGoal({
        level,
        name: name.trim(),
        parentId: parentId || null,
        owner: owner.trim() || null,
        team: team.trim() || null,
        targetDate: targetDate || null,
        status,
      });
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-5">ADD GOAL</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Level */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400 mb-1.5">
                Level / Category
              </label>
              <select
                value={level}
                onChange={(e) => { setLevel(e.target.value as Level); setParentId(''); }}
                className="w-full rounded bg-[#111] border border-[#333] text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:border-green-600"
              >
                {LEVEL_ORDER.map((l) => (
                  <option key={l} value={l}>{LEVEL_LABELS[l]}</option>
                ))}
              </select>
            </div>

            {/* Goal Name */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400 mb-1.5">
                Goal Name
              </label>
              <textarea
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Describe the goal..."
                rows={3}
                className="w-full rounded bg-[#111] border border-[#333] text-zinc-100 px-3 py-2 text-sm resize-none focus:outline-none focus:border-green-600 placeholder-zinc-600"
              />
            </div>

            {/* Parent Goal */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400 mb-1.5">
                Parent Goal
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full rounded bg-[#111] border border-[#333] text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:border-green-600"
                disabled={validParentLevels.length === 0}
              >
                <option value="">None (Top Level)</option>
                {parentOptions.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name.length > 60 ? g.name.slice(0, 60) + '…' : g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Owner */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400 mb-1.5">
                Owner
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="e.g. Engineering, Jane Smith"
                className="w-full rounded bg-[#111] border border-[#333] text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:border-green-600 placeholder-zinc-600"
              />
            </div>

            {/* Team */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400 mb-1.5">
                Team
              </label>
              <div className="flex gap-2">
                {showNewTeam ? (
                  <>
                    <input
                      type="text"
                      value={newTeamInput}
                      onChange={(e) => setNewTeamInput(e.target.value)}
                      placeholder="New team name..."
                      className="flex-1 rounded bg-[#111] border border-[#333] text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:border-green-600 placeholder-zinc-600"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTeam())}
                    />
                    <button
                      type="button"
                      onClick={handleAddTeam}
                      className="px-3 py-2 rounded bg-green-700 text-white text-sm hover:bg-green-600"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewTeam(false)}
                      className="px-3 py-2 rounded bg-[#2a2a2a] text-zinc-400 text-sm hover:bg-[#333]"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <select
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                      className="flex-1 rounded bg-[#111] border border-[#333] text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:border-green-600"
                    >
                      <option value="">—</option>
                      {teams.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewTeam(true)}
                      className="px-3 py-2 rounded bg-[#2a2a2a] text-zinc-300 text-sm hover:bg-[#333] font-medium"
                      title="Add new team"
                    >
                      +
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Target Date */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400 mb-1.5">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded bg-[#111] border border-[#333] text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:border-green-600"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-zinc-400 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full rounded bg-[#111] border border-[#333] text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:border-green-600"
              >
                {(Object.keys(STATUS_LABELS) as Status[]).filter(s => s !== 'n_a').map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 rounded bg-green-600 text-white text-sm font-semibold hover:bg-green-500 disabled:opacity-50 transition-colors"
              >
                {isPending ? 'SAVING...' : 'SAVE GOAL'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
