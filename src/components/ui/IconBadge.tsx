'use client';

import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

type IconBadgeProps = {
  icon: LucideIcon;
  className?: string;
};

export const IconBadge = ({ icon: Icon, className }: IconBadgeProps) => {
  return (
    <div className={clsx('icon-badge flex h-11 w-11 items-center justify-center transition', className)}>
      <Icon className="h-5 w-5" />
    </div>
  );
};
