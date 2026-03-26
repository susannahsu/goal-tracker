'use client';

import type { Goal, Level, Status } from '@/lib/types';
import { LEVEL_DISPLAY, STRATEGY_LEVELS } from '@/lib/types';
import StatusBadge from './StatusBadge';

interface Props {
  goals: Goal[];
}

function WaterfallCard({ goal, compact = false }: { goal: Goal; compact?: boolean }) {
  return (
    <div className={`bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg ${compact ? 'p-3 min-w-[200px] max-w-[240px]' : 'p-4 max-w-[460px] w-full'}`}>
      <div className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase mb-2">
        {LEVEL_DISPLAY[goal.level as Level]} —
      </div>
      <p className={`text-zinc-200 leading-snug ${compact ? 'text-xs' : 'text-sm'}`}>{goal.name}</p>
      {goal.level === 'team_goal' && (
        <div className="mt-3 space-y-1">
          {goal.owner && (
            <div className="flex gap-2 text-xs">
              <span className="text-zinc-600 uppercase tracking-wide w-10 flex-shrink-0">Owner</span>
              <span className="text-zinc-400">{goal.owner}</span>
            </div>
          )}
          {goal.team && (
            <div className="flex gap-2 text-xs">
              <span className="text-zinc-600 uppercase tracking-wide w-10 flex-shrink-0">Team</span>
              <span className="text-zinc-400">{goal.team}</span>
            </div>
          )}
          {goal.targetDate && (
            <div className="flex gap-2 text-xs">
              <span className="text-zinc-600 uppercase tracking-wide w-10 flex-shrink-0">Date</span>
              <span className="text-zinc-400">
                {new Date(goal.targetDate + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short', day: '2-digit', year: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>
      )}
      {STRATEGY_LEVELS.includes(goal.level as Level) && goal.level !== 'mission' && (
        <div className="mt-2">
          <StatusBadge status={goal.status as Status} />
        </div>
      )}
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center py-2">
      <div className="w-px h-6 bg-[#2a2a2a]" />
    </div>
  );
}

export default function WaterfallView({ goals }: Props) {
  const byLevel = (level: Level) => goals.filter((g) => g.level === level);

  const mission = byLevel('mission');
  const whyStrategy = byLevel('why_this_strategy');
  const strategicPosition = byLevel('strategic_position');
  const pillars = byLevel('strategic_pillar');
  const teamGoals = byLevel('team_goal');

  // Group team goals by their parent pillar
  function teamGoalsForPillar(pillarId: string) {
    return teamGoals.filter((g) => g.parentId === pillarId);
  }
  const unattachedTeamGoals = teamGoals.filter(
    (g) => !g.parentId || !pillars.find((p) => p.id === g.parentId)
  );

  const hasPillars = pillars.length > 0;
  const hasTeamGoals = teamGoals.length > 0;

  return (
    <div className="flex-1 overflow-auto py-8 px-6">
      <div className="min-w-[800px] flex flex-col items-center gap-0">

        {/* Mission */}
        {mission.map((g) => (
          <div key={g.id} className="flex justify-center w-full">
            <WaterfallCard goal={g} />
          </div>
        ))}

        {/* Why This Strategy */}
        {whyStrategy.length > 0 && (
          <>
            <Connector />
            <div className="flex justify-center w-full">
              <div className="flex flex-col items-center gap-2">
                {whyStrategy.map((g) => <WaterfallCard key={g.id} goal={g} />)}
              </div>
            </div>
          </>
        )}

        {/* Strategic Position */}
        {strategicPosition.length > 0 && (
          <>
            <Connector />
            <div className="flex justify-center w-full">
              <div className="flex flex-col items-center gap-2">
                {strategicPosition.map((g) => <WaterfallCard key={g.id} goal={g} />)}
              </div>
            </div>
          </>
        )}

        {/* Strategic Pillars */}
        {hasPillars && (
          <>
            <Connector />
            <div className="flex flex-wrap justify-center gap-3 w-full">
              {pillars.map((pillar) => (
                <div key={pillar.id} className="flex flex-col items-center gap-0">
                  <WaterfallCard goal={pillar} compact />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Team Goals — grouped under pillars */}
        {hasTeamGoals && (
          <>
            <Connector />
            <div className="w-full">
              {hasPillars ? (
                <div className="flex flex-wrap justify-center gap-3">
                  {pillars.map((pillar) => {
                    const children = teamGoalsForPillar(pillar.id);
                    if (children.length === 0) return null;
                    return children.map((g) => (
                      <WaterfallCard key={g.id} goal={g} compact />
                    ));
                  })}
                  {unattachedTeamGoals.map((g) => (
                    <WaterfallCard key={g.id} goal={g} compact />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-3">
                  {teamGoals.map((g) => (
                    <WaterfallCard key={g.id} goal={g} compact />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {goals.length === 0 && (
          <div className="text-zinc-600 py-16 text-center">
            <p>No goals yet. Add your first goal to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
