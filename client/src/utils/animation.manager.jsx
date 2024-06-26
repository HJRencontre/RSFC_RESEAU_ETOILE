export const fromLeft = {
  initial: { opacity: 0, x: "100%" },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: "-100%" },
};

export const pageTransition = {
  type: "spring",
  duration: 0.5,
};
