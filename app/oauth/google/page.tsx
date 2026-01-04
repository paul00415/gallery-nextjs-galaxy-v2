import { Suspense } from 'react';
import GoogleOAuthClient from './GoogleOAuthClient';

export default function GoogleOAuthPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20">Signing you in...</p>}>
      <GoogleOAuthClient />
    </Suspense>
  );
}
