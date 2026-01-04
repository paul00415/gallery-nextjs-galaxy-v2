// store/notifListener.ts
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { showNotif } from './notifSlice';

export const notifListener = createListenerMiddleware();

/* ================================
   SUCCESS MESSAGE MAP
================================ */
const SUCCESS_MESSAGES: Record<string, string> = {
  // auth
  'auth/login/fulfilled': 'Login successful',
  'auth/register/fulfilled':
    'Registration successful. Please verify your email.',
  'auth/googleLogin/fulfilled': 'Logged in with Google',

  // photo mutations only
  'photo/upload/fulfilled': 'Photo uploaded successfully',
  'photo/update/fulfilled': 'Photo updated successfully',
  'photo/delete/fulfilled': 'Photo deleted successfully',
};

// SUCCESS HANDLER (ONLY actions in the map)
notifListener.startListening({
  matcher: (action): action is any =>
    action.type.endsWith('/fulfilled') && action.type in SUCCESS_MESSAGES,
  effect: async (action, api) => {
    api.dispatch(
      showNotif({
        id: nanoid(),
        type: 'success',
        message: SUCCESS_MESSAGES[action.type],
      })
    );
  },
});


// ERROR HANDLER (ALL rejected actions, including fetch)
notifListener.startListening({
  matcher: (action): action is any => action.type.endsWith('/rejected'),
  effect: async (action, api) => {
    let message = 'Something went wrong';

    // rejectWithValue (backend error message)
    if (typeof action.payload === 'string') {
      message = action.payload;
    }
    // network / server / unexpected error
    else if (action.error?.message) {
      message = action.error.message;
    }

    api.dispatch(
      showNotif({
        id: nanoid(),
        type: 'error',
        message,
      })
    );
  },
});
