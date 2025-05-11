import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface QueueState {
  queue: string[];
}

const initialState: QueueState = {
  queue: [],
};

export const queueSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
    addToQueue: (state, action: PayloadAction<string>) => {
      if (state.queue.includes(action.payload)) return;
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter((songID) => songID !== action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    getNextSong: (state) => {
      if (state.queue.length === 0) return;
      state.queue.shift();
    },
    addtoFront: (state, action: PayloadAction<string>) => {
      state.queue.unshift(action.payload);
    },
  },
});

export const {
  addToQueue,
  removeFromQueue,
  getNextSong,
  clearQueue,
  addtoFront,
} = queueSlice.actions;

export default queueSlice.reducer;
