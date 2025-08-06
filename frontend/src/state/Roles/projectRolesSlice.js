import api from "@/config/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const assignRole = createAsyncThunk(
  "projectRoles/assign",
  async ({ projectId, userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        `/api/projects/${projectId}/roles`,
        null,
        { params: { userId, role } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao atribuir cargo"
      );
    }
  }
);

export const fetchProjectRoles = createAsyncThunk(
  "projectRoles/fetchByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/projects/${projectId}`);
      return data.roles || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao carregar roles"
      );
    }
  }
);

const projectRolesSlice = createSlice({
  name: "projectRoles",
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRoles: (state) => {
      state.roles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignRole.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(assignRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjectRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchProjectRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearRoles } = projectRolesSlice.actions;
export default projectRolesSlice.reducer;
