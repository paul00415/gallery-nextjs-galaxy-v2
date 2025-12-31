'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Input, Button, Avatar } from '@heroui/react';
import { SearchIcon } from '@heroui/shared-icons';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown';
import { useRouter } from 'next/navigation';
import { Image } from '@heroui/image';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUserThunk } from '@/store/auth/authSlice';

export default function Header() {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    router.push('/');
  };

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Track window width
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-white dark:bg-base-800 px-4 sm:px-6 md:px-8 lg:px-10 py-2 shadow-sm flex flex-row items-center justify-between w-full fixed top-0 z-50">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/images/logo-word.png"
            alt="logo"
            width={96}
            height={64}
          />
        </Link>
      </div>

      <div className="justify-center flex flex-1 px-4">
        <Input
          aria-label="Search"
          placeholder="Search Photos..."
          value={query}
          onValueChange={setQuery}
          startContent={<SearchIcon className="w-4 h-4 text-muted" />}
          classNames={{ mainWrapper: 'w-full min-w-[100px] flex-shrink-0' }}
        />
      </div>

      <div className="justify-end gap-3 flex flex-row items-center">
        {isAuthenticated ? (
          <Dropdown>
            <DropdownTrigger className="cursor-pointer">
              <Avatar name="Guest" src="/images/avatar.png" />
            </DropdownTrigger>

            <DropdownMenu>
              <DropdownItem
                key="my-photos"
                onPress={() => router.push('/my-photos')}
              >
                My Photos
              </DropdownItem>
              <DropdownItem key="logout" onPress={handleLogout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : windowWidth !== null && windowWidth < 450 ? (
          // Mobile dropdown for small screens
          <Dropdown>
            <DropdownTrigger>
              <div className="bg-gray-500 rounded-full w-8 h-8 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white dark:text-white cursor-pointer"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </div>
            </DropdownTrigger>

            <DropdownMenu>
              <DropdownItem key="login" onPress={() => router.push('/login')}>
                Login
              </DropdownItem>
              <DropdownItem
                key="register"
                onPress={() => router.push('/register')}
              >
                Register
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          // Default: show two buttons
          <div className="flex flex-row gap-2">
            <Link href="/login">
              <Button variant="bordered" size="sm">
                Login
              </Button>
            </Link>

            <Link href="/register">
              <Button variant="solid" size="sm">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
