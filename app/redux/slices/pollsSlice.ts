import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PollsState,  } from "@/app/interface";
import { closePollRequest, createPollRequest, fetchPollByIdRequest, fetchPollsRequest } from "@/app/lib/api/polls";

const initialState: PollsState = {
  polls: [],
  pollDetails: null,
  loading: false,
  error: null,
};

// FETCH ALL POLLS
export const fetchAllPolls = createAsyncThunk(
  "polls/fetchAllPolls",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchPollsRequest();
      return res.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue("Failed to fetch polls");
    }
  }
);

// FETCH ONE POLL
export const fetchPollById = createAsyncThunk(
  "polls/fetchPollById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetchPollByIdRequest(id);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue("Poll not found");
    }
  }
);

// CREATE POLL
export const createPoll = createAsyncThunk(
  "polls/createPoll",
  async (data: { title: string; description?: string; options: string[] }, { rejectWithValue }) => {
    try {
      const res = await createPollRequest(data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue("Failed to create poll");
    }
  }
);

// CLOSE POLL
export const closePoll = createAsyncThunk(
  "polls/closePoll",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await closePollRequest(id);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue("Failed to close poll");
    }
  }
);

const pollsSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {
    clearPollDetails(state) {
      state.pollDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ALL POLLS
      .addCase(fetchAllPolls.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.polls = action.payload;
      })
      .addCase(fetchAllPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // POLL DETAIL
      .addCase(fetchPollById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPollById.fulfilled, (state, action) => {
        state.loading = false;
        state.pollDetails = action.payload;
      })
      .addCase(fetchPollById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE POLL
      .addCase(createPoll.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.loading = false;
        state.polls.push(action.payload);
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CLOSE POLL
      .addCase(closePoll.fulfilled, (state, action) => {
        const updated = action.payload;
        state.pollDetails = updated;
      });
  },
});

export const { clearPollDetails } = pollsSlice.actions;

export default pollsSlice.reducer;
