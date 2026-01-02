import { api } from '@/lib/axios';
import axios from 'axios';

interface Photo {
  id: number;
  title: string;
  desc: string;
  imageUrl: string;
  createdAt?: string;
}

export async function getUrls(mimeType: string) {
  const res = await api.post('/photos/signed-upload', {
    mimeType,
  });

  return res.data as {
    uploadUrl: string;
    fileUrl: string;
  };
}

export async function uploadToBucket(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void
) {
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
    onDownloadProgress: (e) => {
      if (!e.total || !onProgress) return;
      onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });
}

export const createPhoto = async (data: {
  title: string;
  desc: string;
  imageUrl: string;
}): Promise<Photo> => {
  const res = await api.post('/photos', data);
  return res.data; // return Photo only
};

export async function fetchRecentPhotosApi() {
  const res = await api.get('/photos/recent');
  return res.data;
}

export async function getPhotosApi(params: {
  query?: string;
  cursor?: number | null;
}) {
  const res = await api.get('/photos', {
    params: {
      query: params.query || undefined,
      cursor: params.cursor || undefined,
      limit: 4,
    },
  });

  return res.data as {
    items: Photo[];
    nextCursor: number | null;
  };
}

export async function fetchOwnerPhotosApi(
  query?: string
) {
  const res = await api.get('/photos/owner', {
    params: {
      ...(query ? { query } : {}),
    },
  });
  return res.data as Photo[];
}

export async function deletePhotoApi(photoId: number): Promise<void> {
  const res = await api.delete(`/photos/${photoId}`);
  return res.data;
}

export async function updatePhotoApi(
  photoId: number,
  data: {
    title: string;
    desc: string;
    imageUrl: string;
  }
): Promise<Photo> {
  const res = await api.patch(`/photos/${photoId}`, data);
  return res.data;
}
