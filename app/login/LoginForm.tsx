'use client';

import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import NormalInput from '../../components/InputFields/NormalInput';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/auth/authSlice';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

    if(!email || !password) {
      return;
    }

    dispatch(login({ email, password }));
  };

  const handleGoogleLogin = () => {
    window.location.href =
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/google`;
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/my-photos');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="max-w-sm mx-auto p-6 border border-gray-100 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome back</h2>

      {/* Google Sign In */}
      <Button
        variant="bordered"
        className="w-full flex items-center justify-center gap-3 mb-4"
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        <Image
          src="/images/google.png"
          alt="Google"
          width={18}
          height={18}
        />
        <span>Sign in with Google</span>
      </Button>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-3 text-sm text-gray-400">OR</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

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
