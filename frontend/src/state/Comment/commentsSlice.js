import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/config/api";

export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async (issueId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/comments/${issueId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao buscar comentários"
      );
    }
  }
);

export const createComment = createAsyncThunk(
  "comments/create",
  async (commentData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/comments", commentData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao criar comentário"
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (commentId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/comments/${commentId}`);
      return commentId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao deletar comentário"
      );
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/update",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/comments/${commentId}`, content, {
        headers: { "Content-Type": "text/plain" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao atualizar comentário"
      );
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(
          (comment) => comment.id !== action.payload
        );
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.map((comment) =>
          comment.id === action.payload.id ? action.payload : comment
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

export default commentSlice.reducer;
