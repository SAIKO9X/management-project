import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/config/api";

export const fetchMilestones = createAsyncThunk(
  "milestones/fetch",
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/milestones/project/${projectId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao buscar milestones"
      );
    }
  }
);

export const createMilestone = createAsyncThunk(
  "milestones/create",
  async (milestoneData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/milestones", milestoneData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao criar milestone"
      );
    }
  }
);

export const deleteMilestone = createAsyncThunk(
  "milestones/delete",
  async (milestoneId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/milestones/${milestoneId}`);
      return milestoneId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao deletar milestone"
      );
    }
  }
);

const milestoneSlice = createSlice({
  name: "milestones",
  initialState: {
    milestones: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMilestones.fulfilled, (state, action) => {
        state.loading = false;
        state.milestones = action.payload;
      })
      .addCase(createMilestone.fulfilled, (state, action) => {
        state.loading = false;
        state.milestones.push(action.payload);
      })
      .addCase(deleteMilestone.fulfilled, (state, action) => {
        state.loading = false;
        state.milestones = state.milestones.filter(
          (milestone) => milestone.id !== action.payload
        );
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default milestoneSlice.reducer;
