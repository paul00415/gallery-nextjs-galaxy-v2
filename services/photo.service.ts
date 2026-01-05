import { api } from '@/lib/axios';
import axios, { AxiosProgressEvent } from 'axios';

interface Photo {
  id: number;
  title: string;
  desc: string;
  imageUrl: string;
  createdAt?: string;
  poster: {
    id: number;
    name: string;
  }
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
  try {
    const res = await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (e?: AxiosProgressEvent) => {
        if (!e?.total || !onProgress) return;
        const loaded = Number(e.loaded ?? 0);
        const total = Number(e.total ?? 0);
        if (!total) return;
        onProgress(Math.round((loaded * 100) / total));
      },
    });

    return res;
  } catch (err) {
    console.error('uploadToBucket failed', err);
    throw err;
  }
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
      limit: 15,
    },
  });

  return res.data as {
    items: Photo[];
    nextCursor: number | null;
  };
}

export async function fetchOwnerPhotosApi(params: {
  query?: string;
  cursor?: number | null;
}) {
  const res = await api.get('/photos/owner', {
    params: {
      query: params.query || undefined,
      cursor: params.cursor || undefined,
      limit: 15,
    },
  });

  return res.data as {
    items: Photo[];
    nextCursor: number | null;
  };
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
