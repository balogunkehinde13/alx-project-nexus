import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { VotesState } from "@/app/interface";
import { submitVoteRequest } from "@/app/lib/api/polls";

const initialState: VotesState = {
  liveResults: {},
  loading: false,
  error: null,
};

// SUBMIT A VOTE
export const submitVote = createAsyncThunk(
  "votes/submitVote",
  async (data: { pollId: string; optionId: string }, { rejectWithValue }) => {
    try {
      const res = await submitVoteRequest(data.pollId, data.optionId);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue("Failed to submit vote");
    }
  }
);

const votesSlice = createSlice({
  name: "votes",
  initialState,
  reducers: {
    updateVotes(state, action) {
      const { pollId, results } = action.payload;
      state.liveResults[pollId] = results;
    },
  },
  extraReducers: (builder) => {
    builder
      // SUBMIT VOTE
      .addCase(submitVote.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitVote.fulfilled, (state, action) => {
        state.loading = false;
        const { pollId, results } = action.payload;
        state.liveResults[pollId] = results;
      })
      .addCase(submitVote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateVotes } = votesSlice.actions;

export default votesSlice.reducer;
