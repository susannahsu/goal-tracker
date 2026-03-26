'use client';

import { useState } from 'react';
import type { Goal, Level, Status } from '@/lib/types';
import { LEVEL_LABELS, LEVEL_ORDER, STATUS_LABELS } from '@/lib/types';
import GoalsTable from './GoalsTable';
import WaterfallView from './WaterfallView';
import AddGoalModal from './AddGoalModal';

interface Props {
  initialGoals: Goal[];
  initialTeams: string[];
}

type View = 'table' | 'waterfall';

export default function GoalTracker({ initialGoals, initialTeams }: Props) {
  const [view, setView] = useState<View>('table');
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [teams, setTeams] = useState<string[]>(initialTeams);

  // Derive unique teams from goals + any locally added
  const allTeams = [...new Set([...teams, ...initialGoals.map((g) => g.team).filter(Boolean) as string[]])].sort();

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-zinc-200">
      {/* Header */}
      <header className="flex items-center justify-center py-4 border-b border-[#1f1f1f] flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Fluidstack logo mark */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#22c55e" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
            <path d="M2 17l10 5 10-5" stroke="#22c55e" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M2 12l10 5 10-5" stroke="#22c55e" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm font-semibold tracking-widest text-zinc-300 uppercase">Fluidstack</span>
        </div>
      </header>

      {/* Tab bar */}
      <div className="flex justify-center gap-1 py-3 border-b border-[#1f1f1f] flex-shrink-0">
        <button
          onClick={() => setView('table')}
          className={`px-6 py-1.5 rounded text-sm font-medium tracking-wider uppercase transition-colors ${
            view === 'table'
              ? 'bg-[#1e1e1e] text-white border border-[#333]'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Goals Table
        </button>
        <button
          onClick={() => setView('waterfall')}
          className={`px-6 py-1.5 rounded text-sm font-medium tracking-wider uppercase transition-colors ${
            view === 'waterfall'
              ? 'bg-[#1e1e1e] text-white border border-[#333]'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Waterfall View
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1f1f1f] flex-shrink-0">
        {/* Search */}
        <input
          type="text"
          placeholder="Search goals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-300 placeholder-zinc-600 px-3 py-1.5 text-sm focus:outline-none focus:border-green-700 w-44"
        />

        {/* Level filter */}
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="rounded bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 px-3 py-1.5 text-sm focus:outline-none focus:border-green-700"
        >
          <option value="all">All Levels</option>
          {LEVEL_ORDER.map((l) => (
            <option key={l} value={l}>{LEVEL_LABELS[l]}</option>
          ))}
        </select>

        {/* Team filter */}
        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="rounded bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 px-3 py-1.5 text-sm focus:outline-none focus:border-green-700"
        >
          <option value="all">All Teams</option>
          {allTeams.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 px-3 py-1.5 text-sm focus:outline-none focus:border-green-700"
        >
          <option value="all">All Statuses</option>
          {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>

        <div className="flex-1" />

        {/* Add Goal */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-1.5 rounded bg-green-600 text-white text-sm font-semibold hover:bg-green-500 transition-colors"
        >
          <span>+</span> ADD GOAL
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {view === 'table' ? (
          <GoalsTable
            goals={initialGoals}
            search={search}
            filterLevel={filterLevel}
            filterTeam={filterTeam}
            filterStatus={filterStatus}
          />
        ) : (
          <WaterfallView goals={initialGoals} />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddGoalModal
          goals={initialGoals}
          teams={allTeams}
          onClose={() => setShowModal(false)}
          onTeamAdded={(t) => setTeams((prev) => [...new Set([...prev, t])])}
        />
      )}
    </div>
  );
}
