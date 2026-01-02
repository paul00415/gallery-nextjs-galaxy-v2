'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRecentPhotos, fetchAllPhotos } from '@/store/photo/photoSlice';

import ImageCarousel from '../components/ImageCarousel';
import ImageListShow from '../components/ImageListShow';

export default function Gallery() {
  const dispatch = useAppDispatch();
  const { recentItems, allImages } =
    useAppSelector((state) => state.photo);

  // initial load
  useEffect(() => {
    dispatch(fetchRecentPhotos());
    dispatch(fetchAllPhotos({ query: ''}));
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
    </div>
  );
}
