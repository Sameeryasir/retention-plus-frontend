export const editorMotion = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.18 },
  },
  slideUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6 },
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 },
  },
  hoverLift: {
    whileHover: { y: -1, scale: 1.01 },
    whileTap: { scale: 0.99 },
    transition: { type: "spring" as const, stiffness: 420, damping: 28 },
  },
  slideRight: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  },
  staggerContainer: {
    animate: {
      transition: { staggerChildren: 0.06, delayChildren: 0.04 },
    },
  },
} as const;

export const pageListContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

export const pageListRowVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
  },
};

export const pageListIconVariants = {
  hidden: { opacity: 0, x: -6 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const pageListLabelVariants = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const pageListEditVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, delay: 0.08 },
  },
};

const headerEase = [0.22, 1, 0.36, 1] as const;

export const headerBarVariants = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: headerEase },
  },
};

export const headerLeftVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

export const headerTextVariants = {
  hidden: { opacity: 0, x: -14 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: headerEase },
  },
};

export const headerActionsVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

export const headerActionItemVariants = {
  hidden: { opacity: 0, x: 12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.26, ease: headerEase },
  },
};
