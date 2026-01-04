import { configureStore } from '@reduxjs/toolkit';
import photoReducer from './photo/photoSlice';
import authReducer from './auth/authSlice';
import { notifListener } from './notif/notifListener';
import notifReducer from './notif/notifSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      photo: photoReducer,
      auth: authReducer,
      notif: notifReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(notifListener.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
