import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ onClose, children, className = "" }: ModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card className={className}>{children}</Card>
      </motion.div>
    </motion.div>
  );
}
