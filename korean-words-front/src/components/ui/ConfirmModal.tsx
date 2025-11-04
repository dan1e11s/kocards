import { motion, AnimatePresence } from 'framer-motion';
import { HiExclamationCircle } from 'react-icons/hi';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

const variantStyles = {
  danger: {
    icon: 'text-red-600',
    bg: 'bg-red-50',
    button: 'danger' as const,
  },
  warning: {
    icon: 'text-orange-600',
    bg: 'bg-orange-50',
    button: 'primary' as const,
  },
  info: {
    icon: 'text-blue-600',
    bg: 'bg-blue-50',
    button: 'primary' as const,
  },
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmModalProps) {
  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className={`w-12 h-12 rounded-full ${styles.bg} flex items-center justify-center mb-4`}>
              <HiExclamationCircle className={`text-3xl ${styles.icon}`} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="flex gap-3">
              <Button
                onClick={onCancel}
                variant="secondary"
                size="md"
                fullWidth
              >
                {cancelText}
              </Button>
              <Button
                onClick={onConfirm}
                variant={styles.button}
                size="md"
                fullWidth
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
