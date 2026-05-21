export const standardEase = [0.22, 1, 0.36, 1] as const;

export const automationEase = standardEase;

export const panelStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

export const funnelPanelStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

export const funnelPanelItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: standardEase },
  },
};

export const panelRowMotion = {
  hidden: { opacity: 0, y: -14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: standardEase },
  },
};

export const panelRevealMotion = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: standardEase },
  },
};

export const automationStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export const automationItem = {
  hidden: { opacity: 0, y: -28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: automationEase },
  },
};

export const flowListStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.06 },
  },
};

export const flowStepReveal = {
  hidden: { opacity: 0, y: -28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: automationEase },
  },
};

export const flowConnectorReveal = {
  hidden: { opacity: 0, scaleY: 0, originY: 0 },
  show: {
    opacity: 1,
    scaleY: 1,
    transition: { duration: 0.28, ease: automationEase },
  },
};
