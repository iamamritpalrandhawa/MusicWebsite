import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SongState {
  songID: string;
}

const initialState: SongState = {
  songID: "",
};

export const songIDSlice = createSlice({
  name: "songID",
  initialState,
  reducers: {
    setSongID: (state, action: PayloadAction<string>) => {
      state.songID = action.payload;
    },
  },
});

export const { setSongID } = songIDSlice.actions;

export default songIDSlice.reducer;
