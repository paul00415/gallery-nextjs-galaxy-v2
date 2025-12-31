'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRecentPhotos, fetchAllPhotos } from '@/store/photo/photoSlice';

import ImageCarousel from '../components/ImageCarousel';
import ImageListShow from '../components/ImageListShow';

export default function Gallery() {
  const dispatch = useAppDispatch();
  const { recentItems, allImages, loading } = useAppSelector(
    (state) => state.photo
  );
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  // initial load
  useEffect(() => {
    dispatch(fetchRecentPhotos());
    dispatch(fetchAllPhotos());
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
          dispatch(fetchAllPhotos());
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [dispatch]);

  const carouselImages = recentItems.map((p) => ({
    title: p.title,
    alt: p.title,
    src: p.imageUrl,
  }));

  return (
    <div className="w-full flex flex-col gap-4 overflow-x-hidden">
      <section className="px-4 sm:px-6 md:px-8 lg:px-10">
        <ImageCarousel
          images={carouselImages}
          mode="scroll"
          scrollDuration={35000}
          direction="right"
        />
      </section>

      <section className="px-4 sm:px-6 md:px-8 lg:px-10">
        <ImageListShow items={allImages} />
      </section>

      <div ref={loaderRef} className="h-10 flex justify-center">
        {loading && <p>Loading more...</p>}
      </div>
    </div>
  );
}
