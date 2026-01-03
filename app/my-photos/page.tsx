'use client';

import { useEffect, useRef, useState } from 'react';
import ImageList from '../../components/ImageList';
import { Button, Input } from '@heroui/react';
import { Plus } from 'lucide-react';
import ImageModal from '../../components/modals/ImageModal';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchOwnerPhotos, resetOwnerPhotos } from '@/store/photo/photoSlice';
import { SearchIcon } from '@heroui/shared-icons';

export default function MyPhotos() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { ownerImages, loading, hasMoreOwner } = useAppSelector((state) => state.photo);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [query, setQuery] = useState('');

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [isAddOpen, setOpen] = useState(false);

  // // Redirect if not logged in
  // useEffect(() => {
  //   if (!isAuthenticated) router.push('/');
  // }, [isAuthenticated, router]);

  // Initial load
   useEffect(() => {
    dispatch(resetOwnerPhotos(query));
    dispatch(fetchOwnerPhotos({ query }));
  }, [dispatch, query]);

  // intersection observer
  useEffect(() => {
    if (!loaderRef.current || !hasMoreOwner || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch(fetchOwnerPhotos({ query }));
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [dispatch, query, hasMoreOwner]);

  return (
    <div className="w-full p-6">
      <div className="mx-auto">
        <div className="flex md:flex-row flex-col items-center justify-between mb-4 gap-3">
          <div>
            <h1 className="text-3xl font-bold">My Photos</h1>
            <p className="text-muted mt-1">
              A place to manage and view your uploaded photos.
            </p>
          </div>

          <Button
            color="primary"
            startContent={<Plus size={18} />}
            onPress={() => setOpen(true)}
          >
            Add Photo
          </Button>
        </div>

        <div className="justify-center flex flex-1 px-4 mt-5">
          <Input
            aria-label="Search"
            placeholder="Search Photos..."
            value={query}
            onValueChange={setQuery}
            startContent={<SearchIcon className="w-4 h-4 text-muted" />}
            classNames={{
              mainWrapper: 'w-full min-w-[100px] flex-shrink-0',
            }}
          />
        </div>
      </div>

      <section className="px-4 sm:px-6 md:px-8 lg:px-10">
        <ImageList items={ownerImages} />
      </section>

      {hasMoreOwner && (
        <div ref={loaderRef} className="h-10 flex justify-center">
          {loading && <p>Loading more...</p>}
        </div>
      )}
      <ImageModal
        isOpen={isAddOpen}
        onClose={() => setOpen(false)}
        mode="add"
      />
    </div>
  );
}
