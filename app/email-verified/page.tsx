'use client';

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8]">
      <div className="bg-white p-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-center">
        <div className="text-green-600 text-2xl font-semibold mb-2">
          ✅ Email Verified!
        </div>

        <p className="text-gray-600">
          Your email has been verified successfully.
        </p>

        <a
          href="/login"
          className="inline-block mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
