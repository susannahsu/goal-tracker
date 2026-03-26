import type { Status } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/types';

const STATUS_DOT: Record<Status, string> = {
  on_track: 'bg-green-500',
  at_risk: 'bg-amber-500',
  behind: 'bg-red-500',
  not_started: 'bg-zinc-500',
  completed: 'bg-green-500',
  n_a: '',
};

const STATUS_TEXT: Record<Status, string> = {
  on_track: 'text-green-400',
  at_risk: 'text-amber-400',
  behind: 'text-red-400',
  not_started: 'text-zinc-400',
  completed: 'text-green-400',
  n_a: 'text-zinc-500',
};

interface Props {
  status: Status;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: Props) {
  const dotColor = STATUS_DOT[status];
  const textColor = STATUS_TEXT[status];

  return (
    <span className={`flex items-center gap-1.5 text-sm font-medium whitespace-nowrap ${textColor} ${className}`}>
      {dotColor && <span className={`inline-block h-2 w-2 rounded-full flex-shrink-0 ${dotColor}`} />}
      {STATUS_LABELS[status]}
    </span>
  );
}
