'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { restoreAuth } from '@/store/auth/authSlice';
import { api } from '@/lib/axios';

export default function GoogleOAuthPage() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = params.get('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    // Save token
    localStorage.setItem('accessToken', token);

    // Fetch user profile
    api
      .get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(restoreAuth({ user: res.data }));
        router.replace('/my-photos');
      })
      .catch(() => {
        router.replace('/login');
      });
  }, [params, dispatch, router]);

  return <p className="text-center mt-20">Signing you in with Google...</p>;
}
