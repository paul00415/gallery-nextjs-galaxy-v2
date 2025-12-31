'use client';

import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import NormalInput from '../../components/InputFields/NormalInput';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/auth/authSlice';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [psdError, setPsdError] = useState('');

  const handleLogin = async () => {
    setEmailError('');
    setPsdError('');

    // Basic validation
    if (!email) {
      setEmailError('Email is required');
    }

    if (!password) {
      setPsdError('Password is required');
    }

    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/my-photos');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="max-w-sm mx-auto p-6 border border-gray-100 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {/* Email input */}
      <NormalInput
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
        error={emailError}
      />

      {/* Password input */}
      <NormalInput
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4"
        error={psdError}
      />

      <Button onPress={handleLogin} disabled={loading} className="w-full">
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      <p className="text-center text-sm text-gray-500 mt-4">
        Do not have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
