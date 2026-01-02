'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRecentPhotos, fetchAllPhotos, resetAllPhotos } from '@/store/photo/photoSlice';
import { SearchIcon } from '@heroui/shared-icons';
import { Input } from '@heroui/react';

import ImageCarousel from '../components/ImageCarousel';
import ImageListShow from '../components/ImageListShow';

export default function Gallery() {
  const dispatch = useAppDispatch();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');

  const { recentItems, allImages, hasMore, loading } = useAppSelector(
    (state) => state.photo
  );

  useEffect(() => {
    dispatch(fetchRecentPhotos());
  }, [dispatch]);

  // reset when query changes
  useEffect(() => {
    dispatch(resetAllPhotos(query));
    dispatch(fetchAllPhotos({ query }));
  }, [dispatch, query]);

  // infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch(fetchAllPhotos({ query }));
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [dispatch, hasMore, loading, query]);

  const carouselImages = recentItems.map((p) => ({
    title: p.title,
    alt: p.title,
    src: p.imageUrl,
  }));

  return (
    <div className="w-full flex flex-col gap-4 overflow-x-hidden">
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

      <section className="px-4 sm:px-6 md:px-8 lg:px-10">
        <h2>Recent Photos</h2>
        <ImageCarousel
          images={carouselImages}
          mode="scroll"
          scrollDuration={35000}
          direction="right"
        />
      </section>

      <section className="px-4 sm:px-6 md:px-8 lg:px-10">
        <h2>All Photos</h2>
        <ImageListShow items={allImages} />
      </section>

      {hasMore && (
        <div ref={loaderRef} className="h-10 text-center">
          Loading...
        </div>
      )}
    </div>
  );
}
