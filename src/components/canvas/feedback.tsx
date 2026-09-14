import { motion } from "motion/react";
import type { ReactNode } from "react";

type FeedbackProps = { icon: ReactNode; title: string; text: string; action?: ReactNode; error?: boolean };

export function Feedback({ icon, title, text, action, error = false }: FeedbackProps) {
  return <motion.div className={"feedback-panel" + (error ? " error-panel" : "")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{icon}<h2>{title}</h2><p>{text}</p>{action}</motion.div>;
}
