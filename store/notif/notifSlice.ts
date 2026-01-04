// store/notif/notifSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotifType = 'success' | 'error';

export interface Notif {
  id: string;
  type: NotifType;
  message: string;
}

interface NotifState {
  list: Notif[];
}

const initialState: NotifState = {
  list: [],
};

const notifSlice = createSlice({
  name: 'notif',
  initialState,
  reducers: {
    showNotif(state, action: PayloadAction<Notif>) {
      state.list.push(action.payload);
    },
    removeNotif(state, action: PayloadAction<string>) {
      state.list = state.list.filter((n) => n.id !== action.payload);
    },
    clearNotifs(state) {
      state.list = [];
    },
  },
});

export const { showNotif, removeNotif, clearNotifs } = notifSlice.actions;
export default notifSlice.reducer;
