import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/config/api";

export const fetchAttachments = createAsyncThunk(
  "attachments/fetch",
  async (issueId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/attachments/issue/${issueId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao buscar anexos"
      );
    }
  }
);

export const uploadAttachment = createAsyncThunk(
  "attachments/upload",
  async ({ file, issueId }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("issueId", issueId);
      const { data } = await api.post("/api/attachments/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao fazer upload"
      );
    }
  }
);

export const deleteAttachment = createAsyncThunk(
  "attachments/delete",
  async (attachmentId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/attachments/${attachmentId}`);
      return attachmentId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao deletar anexo"
      );
    }
  }
);

const attachmentSlice = createSlice({
  name: "attachments",
  initialState: {
    attachments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttachments.fulfilled, (state, action) => {
        state.loading = false;
        state.attachments = action.payload;
      })
      .addCase(uploadAttachment.fulfilled, (state, action) => {
        state.loading = false;
        state.attachments.push(action.payload);
      })
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        state.loading = false;
        state.attachments = state.attachments.filter(
          (attachment) => attachment.id !== action.payload
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

export default attachmentSlice.reducer;
