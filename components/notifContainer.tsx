// components/NotifContainer.tsx
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeNotif } from '@/store/notif/notifSlice';

export default function NotifContainer() {
  const notifs = useAppSelector((state) => state.notif.list);
  const dispatch = useAppDispatch();

  useEffect(() => {
    notifs.forEach((n) => {
      const timer = setTimeout(() => {
        dispatch(removeNotif(n.id));
      }, 3000);
      return () => clearTimeout(timer);
    });
  }, [notifs, dispatch]);

  if (notifs.length === 0) return null;

  return (
    <div className="fixed top-5 right-4 z-[9999] space-y-2">
      {notifs.map((n) => (
        <div
          key={n.id}
          className={`
            px-4 py-2 rounded shadow-lg text-white
            ${n.type === 'success' && 'bg-green-600'}
            ${n.type === 'error' && 'bg-red-600'}
          `}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
