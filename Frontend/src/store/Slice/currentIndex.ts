import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentIndexState {
  currentIndex: number;
}

const initialState: CurrentIndexState = {
  currentIndex: -1,
};

const currentIndexSlice = createSlice({
  name: "currentIndex",
  initialState,
  reducers: {
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    incrementIndex: (state) => {
      state.currentIndex += 1;
    },
    decrementIndex: (state) => {
      state.currentIndex -= 1;
    },
  },
});

export const { setCurrentIndex, incrementIndex, decrementIndex } =
  currentIndexSlice.actions;
export default currentIndexSlice.reducer;
