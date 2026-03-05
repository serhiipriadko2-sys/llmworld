import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Notification } from '../hooks/useGameEngine';

interface NotificationListProps {
  notifications: Notification[];
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  return (
    <div className="absolute top-20 left-0 right-0 z-50 flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map(note => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${
              note.type === 'positive' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              note.type === 'negative' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
              'bg-zinc-800/80 text-zinc-300 border border-zinc-700'
            }`}
          >
            {note.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
