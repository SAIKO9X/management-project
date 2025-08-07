import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/config/api";

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/messages/chat/${projectId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao buscar mensagens"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/messages/send", messageData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao enviar mensagem"
      );
    }
  }
);

export const fetchChatByProject = createAsyncThunk(
  "chat/fetchChatByProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/projects/${projectId}/chat`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao buscar chat do projeto"
      );
    }
  }
);

export const fetchChatMessages = createAsyncThunk(
  "chat/fetchChatMessages",
  async (chatId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/messages/chat/${chatId}`);
      return { chatId, messages: data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao buscar mensagens do chat"
      );
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/messages/${messageId}`);
      return messageId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateMessage = createAsyncThunk(
  "chat/updateMessage",
  async ({ messageId, content }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/messages/${messageId}`, content, {
        headers: { "Content-Type": "text/plain" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    chat: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(fetchChatByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.chat = action.payload;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = state.messages.filter(
          (message) => message.id !== action.payload
        );
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = state.messages.map((message) =>
          message.id === action.payload.id ? action.payload : message
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

export default chatSlice.reducer;
