import { configureStore } from '@reduxjs/toolkit';
import photoReducer from './photo/photoSlice';
import authReducer from './auth/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      photo: photoReducer,
      auth: authReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
