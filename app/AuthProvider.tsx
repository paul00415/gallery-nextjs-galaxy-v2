'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { restoreAuth, logoutUserThunk } from '@/store/auth/authSlice';
import { api } from '../lib/axios';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) return;

    // OPTIONAL: validate token by fetching /me
    api
      .get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(restoreAuth({ user: res.data }));
      })
      .catch(() => {
        dispatch(logoutUserThunk());
      });
  }, [dispatch]);

  return <>{children}</>;
}
