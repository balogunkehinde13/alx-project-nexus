import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PollsState } from "@/app/interface";
import {
  closePollRequest,
  createPollRequest,
  fetchPollByIdRequest,
  fetchPollsRequest,
} from "@/app/lib/api/polls";
import api from "@/app/lib/axiosInstance";

const initialState: PollsState = {
  polls: [], // raw list from backend
  filtered: [], // NEW: filtered list
  pollDetails: null,
  loading: false,
  error: null,
};

/* ============================
   FETCH ALL POLLS
============================ */
export const fetchAllPolls = createAsyncThunk(
  "polls/fetchAllPolls",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchPollsRequest();
      return res.data;
    } catch {
      return rejectWithValue("Failed to fetch polls");
    }
  }
);

/* ============================
   FETCH ONE POLL
============================ */
export const fetchPollById = createAsyncThunk(
  "polls/fetchPollById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetchPollByIdRequest(id);
      return res.data;
    } catch {
      return rejectWithValue("Poll not found");
    }
  }
);

/* ============================
   CREATE POLL
============================ */
export const createPoll = createAsyncThunk(
  "polls/createPoll",
  async (
    data: {
      title: string;
      description?: string;
      options: string[];
      createdBy: string;
      creatorName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await createPollRequest(data);
      return res.data;
    } catch {
      return rejectWithValue("Failed to create poll");
    }
  }
);

/* ============================
   CLOSE POLL
============================ */
export const closePoll = createAsyncThunk(
  "polls/closePoll",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await closePollRequest(id);
      return res.data;
    } catch {
      return rejectWithValue("Failed to close poll");
    }
  }
);

/* ============================
   DELETE POLL
============================ */
export const deletePoll = createAsyncThunk(
  "polls/deletePoll",
  async (
    { pollId, requesterId }: { pollId: string; requesterId: string },
    { rejectWithValue }
  ) => {
    try {
      await api.delete(`/polls/${pollId}`, {
        data: { requesterId },
      });
      return { pollId };
    } catch {
      return rejectWithValue("Failed to delete poll");
    }
  }
);

/* ============================
   SLICE
============================ */
const pollsSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {
    setPolls(state, action) {
      state.polls = action.payload;
    },
    clearPollDetails(state) {
      state.pollDetails = null;
    },

    // ⭐ NEW reducer for filtering client-side
    setFilteredPolls(state, action) {
      state.filtered = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      /* =====================
         ALL POLLS
      ====================== */
      .addCase(fetchAllPolls.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.polls = action.payload;
        state.filtered = action.payload; // <- keep filtered in sync
      })
      .addCase(fetchAllPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* =====================
         POLL DETAIL
      ====================== */
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

      /* =====================
         CREATE POLL
      ====================== */
      .addCase(createPoll.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.loading = false;

        if (!action.payload || !action.payload.id) return;

        state.polls.push(action.payload);
        state.filtered.push(action.payload);
      })

      .addCase(createPoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* =====================
         CLOSE POLL
      ====================== */
      .addCase(closePoll.fulfilled, (state, action) => {
        const updated = action.payload;

        // Safety check
        if (!updated || !updated.id) return;

        state.pollDetails = updated;

        // Filter out undefined values and update
        state.polls = state.polls
          .filter(Boolean)
          .map((p) => (p?.id === updated.id ? updated : p));

        state.filtered = state.filtered
          .filter(Boolean)
          .map((p) => (p?.id === updated.id ? updated : p));
      })

      /* =====================
         DELETE POLL
      ====================== */
      .addCase(deletePoll.fulfilled, (state, action) => {
        const { pollId } = action.payload;

        state.polls = state.polls.filter((p) => p.id !== pollId);
        state.filtered = state.filtered.filter((p) => p.id !== pollId);

        if (state.pollDetails?.id === pollId) {
          state.pollDetails = null;
        }
      });
  },
});

/* ============================
   EXPORTS
============================ */
export const { clearPollDetails, setFilteredPolls, setPolls } =
  pollsSlice.actions;

export default pollsSlice.reducer;
