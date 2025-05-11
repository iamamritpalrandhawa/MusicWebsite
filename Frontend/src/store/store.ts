import { configureStore } from "@reduxjs/toolkit";
import querySlice from "@/store/Slice/query";
import queueSlice from "@/store/Slice/queue";
import songIDSlice from "@/store/Slice/song";
import currentIndex from "@/store/Slice/currentIndex";

export const store = configureStore({
  reducer: {
    query: querySlice,
    queue: queueSlice,
    songID: songIDSlice,
    currentIndex: currentIndex,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
