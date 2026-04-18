import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Notification } from '../hooks/useGameEngine';

interface NotificationListProps {
  notifications: Notification[];
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  return (
    <div className="pointer-events-none absolute right-4 top-4 z-50 flex w-full max-w-sm flex-col items-end gap-2 sm:right-6 sm:top-6">
      <AnimatePresence>
        {notifications.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: -16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.94 }}
            className={`w-full rounded-2xl border px-4 py-3 text-xs font-medium shadow-[0_18px_40px_rgba(0,0,0,0.24)] backdrop-blur-md ${
              note.type === 'positive'
                ? 'border-[rgba(79,208,166,0.28)] bg-[rgba(79,208,166,0.14)] text-[var(--text-primary)]'
                : note.type === 'negative'
                  ? 'border-[rgba(242,139,151,0.28)] bg-[rgba(242,139,151,0.12)] text-[var(--text-primary)]'
                  : 'border-white/10 bg-[rgba(7,17,22,0.82)] text-[var(--text-muted)]'
            }`}
          >
            {note.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
