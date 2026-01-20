import type { Transition, Variants } from 'framer-motion';

export const motionTokens = {
  fast: 0.12,
  base: 0.15,
  slow: 0.28,
  ease: [0.4, 0, 0.2, 1] as const,
  easeOut: [0.16, 1, 0.3, 1] as const,
};

export const motionTransitions: Record<'fast' | 'base' | 'slow', Transition> = {
  fast: { duration: motionTokens.fast, ease: motionTokens.ease },
  base: { duration: motionTokens.base, ease: motionTokens.ease },
  slow: { duration: motionTokens.slow, ease: motionTokens.easeOut },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0, transition: motionTransitions.slow },
  exit: { opacity: 0, y: 4, transition: motionTransitions.fast },
};

export const buttonPress: Variants = {
  rest: { scale: 1 },
  pressed: { scale: 0.98, transition: motionTransitions.fast },
};

export const cardHover: Variants = {
  rest: { y: 0 },
  hover: { y: -2, transition: motionTransitions.fast },
};

export const listStagger: Variants = {
  animate: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
};
