'use client';

import { useEffect, useRef, useState } from 'react';
import ImageList from '../../components/ImageList';
import { Button } from '@heroui/react';
import { Plus } from 'lucide-react';
import ImageModal from '../../components/modals/ImageModal';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchOwnerPhotos } from '@/store/photo/photoSlice';

export default function MyPhotos() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { ownerImages, loading } = useAppSelector((state) => state.photo);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const [isAddOpen, setOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) router.push('/');
  }, [isAuthenticated, router]);

  // Initial load
  useEffect(() => {
    dispatch(fetchOwnerPhotos({ query: ''}));
    
  }, [dispatch]);

  // keep loading state in ref (no rerender)
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  // intersection observer (RUN ONCE)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          dispatch(fetchOwnerPhotos({ query: '' }));
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [dispatch]);

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

        <ImageList items={ownerImages} />
      </div>

      <div ref={loaderRef} className="h-10 flex justify-center">
        {loading && <p>Loading more...</p>}
      </div>

      <ImageModal
        isOpen={isAddOpen}
        onClose={() => setOpen(false)}
        mode="add"
      />
    </div>
  );
}
