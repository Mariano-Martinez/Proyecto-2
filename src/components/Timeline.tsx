'use client';

import clsx from 'clsx';
import { ClockIcon } from '@heroicons/react/24/outline';
import { formatDateTimeEsAR, sortEventsNewestFirst } from '@/lib/tracking/dates';
import { TrackingEvent } from '@/lib/tracking/types';
import { useMemo, useState } from 'react';

type TimelineProps = {
  events: TrackingEvent[];
  dateVariant?: 'short' | 'full';
  initialVisible?: number;
  className?: string;
};

export const Timeline = ({ events, dateVariant = 'short', initialVisible = 6, className }: TimelineProps) => {
  const sortedEvents = useMemo(() => sortEventsNewestFirst(events), [events]);
  const [expanded, setExpanded] = useState(false);
  const visibleEvents = expanded ? sortedEvents : sortedEvents.slice(0, initialVisible);

  if (sortedEvents.length === 0) {
    return <p className={clsx('mt-4 text-sm text-slate-600', className)}>Todavía no hay novedades del envío.</p>;
  }

  return (
    <div className={clsx('mt-4', className)}>
      <ol className="relative space-y-4 border-l border-slate-200 pl-4">
        {visibleEvents.map((event, index) => {
          const formatted = formatDateTimeEsAR(event.timestamp, dateVariant) || 'Sin fecha';
          return (
            <li key={`${event.timestamp}-${index}`} className="relative">
              <span className="absolute -left-2 mt-1 h-3 w-3 rounded-full bg-sky-500" />
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <ClockIcon className="h-4 w-4" />
                <span>{formatted}</span>
                {event.location && <span>• {event.location}</span>}
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-900 whitespace-pre-line break-words">{event.description}</p>
            </li>
          );
        })}
      </ol>
      {sortedEvents.length > initialVisible && (
        <button
          type="button"
          className="ui-transition ui-focus-ring mt-3 text-sm font-semibold text-sky-600 hover:text-sky-500"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? 'Mostrar menos' : 'Mostrar más'}
        </button>
      )}
    </div>
  );
};
