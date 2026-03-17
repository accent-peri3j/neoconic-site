import { motion } from "motion/react";

interface PageTransitionProps {
  children: React.ReactNode;
  pathname: string;
}

export function PageTransition({ children, pathname }: PageTransitionProps) {
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
