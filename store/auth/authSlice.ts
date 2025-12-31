import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { registerUser, loginUser, logoutUser } from '@/services/auth.service';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // register-specific
  registered: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registered: false,
};

export const register = createAsyncThunk<
  void,
  RegisterPayload,
  { rejectValue: string }
>('auth/register', async (payload, { rejectWithValue }) => {
  try {
    await registerUser(payload);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message ?? 'Registration failed'
      );
    }
    return rejectWithValue('Registration failed');
  }
});

export const login = createAsyncThunk<
  { user: User; accessToken: string },
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const res = await loginUser(payload);

    return {
      user: res.user,
      accessToken: res.accessToken,
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message ?? 'Login failed');
    }
    return rejectWithValue('Login failed');
  }
});

export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutUser();

    // Clear token after backend success
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message ?? 'Logout failed');
    }
    return rejectWithValue('Logout failed');
  }
});

//   Slice

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 🔹 Used after reload to restore auth state
    restoreAuth(state, action: PayloadAction<{ user: User | null }>) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    resetRegisterState(state) {
      state.loading = false;
      state.error = null;
      state.registered = false;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===== Register ===== */
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registered = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.registered = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Registration failed';
      })

      /* ===== Login ===== */
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        // ✅ Persist ONLY token
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', action.payload.accessToken);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
        state.isAuthenticated = false;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Logout failed';
      });
  },
});

/* =====================
   Exports
===================== */

export const { restoreAuth, resetRegisterState } = authSlice.actions;

export default authSlice.reducer;
