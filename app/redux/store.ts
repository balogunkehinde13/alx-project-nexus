import { configureStore } from "@reduxjs/toolkit";
import pollsReducer from "./slices/pollsSlice";
import votesReducer from "./slices/votesSlice";

const store = configureStore({
  reducer: {
    polls: pollsReducer,
    votes: votesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
