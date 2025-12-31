import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between transition-all duration-300 w-full fixed bottom-0 z-50 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo-image.png"
            alt="Gallery"
            className="rounded"
            width={40}
            height={40}
          />
          <span className="ml-2 font-semibold">Gallery</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Footer navigation"
        className="flex gap-4 opacity-100 sm:opacity-100 md:opacity-100 sm:flex transition-opacity duration-300 hidden sm:flex"
      >
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          href="/my-photos"
          className="text-sm text-muted hover:text-foreground transition-colors duration-200"
        >
          My Photos
        </Link>
      </nav>

      {/* Social Icons */}
      <div className="flex gap-3 opacity-100 transition-opacity duration-300 hidden md:flex">
        {/* GitHub */}
        <a
          href="https://github.com"
          aria-label="GitHub"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-foreground transition-colors duration-200"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 .5C5.37.5 0 5.88 0 12.5c0 5.28 3.438 9.75 8.205 11.33.6.113.82-.263.82-.583 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.303 3.492.997.108-.78.42-1.303.763-1.603-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.47-2.382 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.323 3.3 1.23a11.5 11.5 0 0 1 3.003-.403c1.018.005 2.044.138 3.003.403 2.29-1.553 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.624-5.48 5.92.43.372.815 1.102.815 2.222 0 1.604-.015 2.896-.015 3.29 0 .322.216.699.825.58C20.565 22.246 24 17.78 24 12.5 24 5.88 18.627.5 12 .5z" />
          </svg>
        </a>

        {/* Twitter */}
        <a
          href="https://twitter.com"
          aria-label="Twitter"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-foreground transition-colors duration-200"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M23 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.38 4.482A13.94 13.94 0 0 1 1.671 3.149a4.916 4.916 0 0 0 1.523 6.573 4.9 4.9 0 0 1-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 0 1-2.224.084 4.923 4.923 0 0 0 4.6 3.417A9.867 9.867 0 0 1 .96 19.54 13.94 13.94 0 0 0 7.548 21c9.142 0 14.307-7.721 13.995-14.646A9.936 9.936 0 0 0 23 4.557z" />
          </svg>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com"
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-foreground transition-colors duration-200"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM18.5 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
          </svg>
        </a>
      </div>

      {/* Copyright */}
      <div className="text-sm text-muted opacity-100 transition-opacity duration-300">
        © {year} Gallery. All rights reserved.
      </div>
    </div>
  );
}
