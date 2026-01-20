'use client';

import { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { motionTransitions } from '@/lib/motion';

type MotionProviderProps = {
  children: ReactNode;
};

export const MotionProvider = ({ children }: MotionProviderProps) => {
  return (
    <MotionConfig reducedMotion="user" transition={motionTransitions.base}>
      {children}
    </MotionConfig>
  );
};
