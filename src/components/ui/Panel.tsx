'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

type PanelProps = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
};

export const Panel = ({ children, className, interactive }: PanelProps) => {
  return (
    <div className={clsx('panel', interactive && 'ui-hover-lift', className)}>
      {children}
    </div>
  );
};
