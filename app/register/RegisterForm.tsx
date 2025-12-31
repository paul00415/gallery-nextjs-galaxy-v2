'use client';

import { useState, useEffect, useEffectEvent } from 'react';
import { Button } from '@heroui/react';
import NormalInput from '../../components/InputFields/NormalInput';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register, resetRegisterState } from '@/store/auth/authSlice';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error, registered, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [psd, setPsd] = useState('');
  const [psdError, setPsdError] = useState('');
  const [confirmPsd, setConfirmPsd] = useState('');
  const [confirmPsdError, setConfirmPsdError] = useState('');

  const handleRegister = async () => {
    setNameError('');
    setEmailError('');
    setPsdError('');
    setConfirmPsdError('');

    // Basic validation
    if (!name) setNameError('Name is required');
    if (!email) setEmailError('Email is required');
    if (!psd) setPsdError('Password is required');
    if (psd !== confirmPsd) setConfirmPsdError('Passwords do not match');

    await dispatch(
      register({
        name,
        email,
        password: psd,
      })
    );
  };

  const initInputs = useEffectEvent(() => {
    setName('');
    setEmail('');
    setPsd('');
    setConfirmPsd('');
  });

  useEffect(() => {
    if (registered) {
      alert('Registered successfully. Please verify your email');
      dispatch(resetRegisterState());
      initInputs();
    }
  }, [registered, dispatch]);

  useEffect(() => {
    if (!registered) {
      router.push('/login');
    }
  }, [registered, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="max-w-sm mx-auto p-6 border border-gray-100 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      {/* Name */}
      <NormalInput
        type="text"
        label="name"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
        error={nameError}
      />

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
        label="psd"
        placeholder="Enter your password"
        value={psd}
        onChange={(e) => setPsd(e.target.value)}
        className="mb-4"
        error={psdError}
      />

      {/* Confirm Password */}
      <NormalInput
        type="password"
        label="confirmPsd"
        placeholder="Enter your password again"
        value={confirmPsd}
        onChange={(e) => setConfirmPsd(e.target.value)}
        className="mb-4"
        error={confirmPsdError}
      />

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      {/* Register button */}
      <Button onPress={handleRegister} disabled={loading} className="w-full">
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </div>
  );
}
