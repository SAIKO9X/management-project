import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/config/api";

export const fetchIssues = createAsyncThunk(
  "issues/fetch",
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/issues/project/${projectId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao buscar issues"
      );
    }
  }
);

export const fetchIssueById = createAsyncThunk(
  "issues/fetchById",
  async (issueId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/issues/${issueId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao buscar issue por ID"
      );
    }
  }
);

export const createIssue = createAsyncThunk(
  "issues/create",
  async (issueData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/issues", issueData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao criar issue"
      );
    }
  }
);

export const deleteIssue = createAsyncThunk(
  "issues/delete",
  async (issueId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/issues/${issueId}`);
      return issueId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao deletar issue"
      );
    }
  }
);

export const updateIssueStatus = createAsyncThunk(
  "issues/updateStatus",
  async ({ issueId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/issues/${issueId}/status/${status}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao atualizar status"
      );
    }
  }
);

export const updateIssue = createAsyncThunk(
  "issues/updateFull",
  async ({ issueId, issueData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/issues/${issueId}`, issueData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao atualizar issue"
      );
    }
  }
);

export const assignUserToIssue = createAsyncThunk(
  "issues/assignUser",
  async ({ issueId, userId }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/api/issues/${issueId}/assignee/${userId}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao atribuir usuário"
      );
    }
  }
);

const issueSlice = createSlice({
  name: "issues",
  initialState: {
    issues: [],
    issueDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload;
      })
      .addCase(fetchIssueById.fulfilled, (state, action) => {
        state.loading = false;
        state.issueDetails = action.payload;
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.issues.push(action.payload);
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = state.issues.filter(
          (issue) => issue.id !== action.payload
        );
      })
      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = state.issues.map((issue) =>
          issue.id === action.payload.id ? action.payload : issue
        );
        if (state.issueDetails?.id === action.payload.id) {
          state.issueDetails = action.payload;
        }
      })
      .addCase(assignUserToIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = state.issues.map((issue) =>
          issue.id === action.payload.id ? action.payload : issue
        );
        if (state.issueDetails?.id === action.payload.id) {
          state.issueDetails = action.payload;
        }
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = state.issues.map((issue) =>
          issue.id === action.payload.id ? action.payload : issue
        );
        if (state.issueDetails?.id === action.payload.id) {
          state.issueDetails = action.payload;
        }
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

export default issueSlice.reducer;
