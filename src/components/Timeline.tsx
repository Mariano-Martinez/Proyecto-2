import { TimelineEvent } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ClockIcon } from '@heroicons/react/24/outline';

export const Timeline = ({ events }: { events: TimelineEvent[] }) => {
  return (
    <ol className="relative mt-4 space-y-4 border-l border-slate-200 pl-4">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span className="absolute -left-2 mt-1 h-3 w-3 rounded-full bg-sky-500" />
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ClockIcon className="h-4 w-4" />
            {format(new Date(event.date), 'dd MMM, HH:mm', { locale: es })}
            {event.location && <span>• {event.location}</span>}
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900">{event.label}</p>
        </li>
      ))}
    </ol>
  );
};
