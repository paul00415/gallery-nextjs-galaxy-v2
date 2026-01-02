import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  getUrls,
  uploadToBucket,
  createPhoto,
  fetchRecentPhotosApi,
  getPhotosApi,
  fetchOwnerPhotosApi,
  deletePhotoApi,
  updatePhotoApi,
} from '@/services/photo.service';

interface UploadPhotoPayload {
  image: File;
  title: string;
  description: string;
}

interface Photo {
  id: number;
  title: string;
  desc: string;
  imageUrl: string;
  createdAt?: string;
}

interface PhotoState {
  recentItems: Photo[];

  allImages: Photo[];

  ownerImages: Photo[];

  loading: boolean;
  query: string;
  lastCursor: number | null;
  hasMore: boolean;
  error: string | null;
}

const initialState: PhotoState = {
  recentItems: [],
  allImages: [],
  ownerImages: [],
  loading: false,
  query: '',
  error: null,
  lastCursor: null,
  hasMore: true,
};

export const uploadPhoto = createAsyncThunk<
  Photo, // return type
  UploadPhotoPayload,
  { rejectValue: string }
>('photo/upload', async (payload, { rejectWithValue }) => {
  try {
    const { uploadUrl, fileUrl } = await getUrls(payload.image.type);

    await uploadToBucket(uploadUrl, payload.image);

    const createdPhoto = await createPhoto({
      title: payload.title,
      desc: payload.description,
      imageUrl: fileUrl,
    });

    return createdPhoto; // Photo, not boolean
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    return rejectWithValue('Upload failed');
  }
});

export const fetchRecentPhotos = createAsyncThunk(
  'photos/recent',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchRecentPhotosApi();
      return res;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Failed to load photos');
    }
  }
);

export const fetchAllPhotos = createAsyncThunk<
  { items: Photo[]; nextCursor: number | null },
  { query?: string },
  { state: { photo: PhotoState } }
>('photos/get', async ({ query }, { getState }) => {
  const state = getState().photo;

  return await getPhotosApi({
    query,
    cursor: state.lastCursor,
  });
});

export const fetchOwnerPhotos = createAsyncThunk<
  Photo[],
  { query?: string },
  { state: { photo: PhotoState }; rejectValue: string }
>('photos/owner', async ({ query }, { rejectWithValue }) => {
  try {
    return await fetchOwnerPhotosApi(query);
  } catch {
    return rejectWithValue('Failed to load photos');
  }
});

export const deletePhoto = createAsyncThunk<
  number, // return deleted photo id
  number, // photo id
  { rejectValue: string }
>('photo/delete', async (photoId, { rejectWithValue }) => {
  try {
    await deletePhotoApi(photoId);
    return photoId;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message ?? 'Delete failed');
    }

    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }

    return rejectWithValue('Delete failed');
  }
});

export const updatePhoto = createAsyncThunk<
  Photo,
  {
    id: number;
    title: string;
    desc: string;
    image?: File | null;
    oldImageUrl: string;
  },
  { rejectValue: string }
>('photo/update', async (payload, { rejectWithValue }) => {
  try {
    let imageUrl = payload.oldImageUrl;

    if (payload.image) {
      const { uploadUrl, fileUrl } = await getUrls(payload.image.type);
      await uploadToBucket(uploadUrl, payload.image);
      imageUrl = fileUrl;
    }

    return await updatePhotoApi(payload.id, {
      title: payload.title,
      desc: payload.desc,
      imageUrl,
    });
  } catch {
    return rejectWithValue('Update failed');
  }
});

const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    resetAllPhotos: (state, action) => {
      state.allImages = [];
      state.lastCursor = null;
      state.hasMore = true;
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // upload
      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.recentItems.unshift(action.payload);
        state.allImages.unshift(action.payload);
        state.ownerImages.unshift(action.payload);
        if (state.recentItems.length > 10) {
          state.recentItems.pop();
        }
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetch recent images
      .addCase(fetchRecentPhotos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.recentItems = action.payload;
      })
      .addCase(fetchRecentPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetch all images
      .addCase(fetchAllPhotos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPhotos.fulfilled, (state, action) => {
        state.loading = false;

        const newItems = action.payload.items.filter(
          (n) => !state.allImages.some((p) => p.id === n.id)
        );

        state.allImages.push(...newItems);
        state.lastCursor = action.payload.nextCursor;
        state.hasMore = Boolean(action.payload.nextCursor);
      })
      .addCase(fetchAllPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetch owner images
      .addCase(fetchOwnerPhotos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOwnerPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerImages = action.payload;
      })
      .addCase(fetchOwnerPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // delete photo
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;

        const id = action.payload;

        state.recentItems = state.recentItems.filter((p) => p.id !== id);
        state.allImages = state.allImages.filter((p) => p.id !== id);
        state.ownerImages = state.ownerImages.filter((p) => p.id !== id);
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // update photo
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;

        const updated = action.payload;
        console.log('updated', updated);

        const updateList = (list: Photo[]) =>
          list.map((p) => (p.id === updated.id ? updated : p));

        state.recentItems = updateList(state.recentItems);
        state.allImages = updateList(state.allImages);
        state.ownerImages = updateList(state.ownerImages);
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAllPhotos } = photoSlice.actions;
export default photoSlice.reducer;
