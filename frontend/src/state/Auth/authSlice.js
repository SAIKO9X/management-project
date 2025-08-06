import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/config/api";

const BASE_URL = "/auth";

const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  loading: false,
  error: null,
};

const setLoadingState = (state) => {
  state.loading = true;
  state.error = null;
};

const handleAuthSuccess = (state, action) => {
  state.loading = false;
  state.error = null;
  state.accessToken = action.payload.accessToken;
  state.refreshToken = action.payload.refreshToken;

  // Persiste os tokens no localStorage
  localStorage.setItem("accessToken", action.payload.accessToken);
  localStorage.setItem("refreshToken", action.payload.refreshToken);

  // Configura o header padrão para o Axios
  api.defaults.headers.common.Authorization = `Bearer ${action.payload.accessToken}`;
};

const handleUserSuccess = (state, action) => {
  state.loading = false;
  state.error = null;
  state.user = action.payload;
};

const handleError = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

// Thunks
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`${BASE_URL}/register`, userData);
      if (data.success) {
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao registrar"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post(`${BASE_URL}/login`, userData);
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      dispatch(getUser());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Erro ao logar");
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Verificamos se temos um token antes de fazer a requisição
      const { accessToken } = getState().auth;

      if (!accessToken) {
        return rejectWithValue("Usuário não autenticado");
      }

      const { data } = await api.get("/api/users/profile");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao obter perfil"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    delete api.defaults.headers.common.Authorization;

    return {};
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    { fullName, currentPassword, newPassword, profilePicture },
    { getState, rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      if (fullName) formData.append("fullName", fullName);
      if (currentPassword) formData.append("currentPassword", currentPassword);
      if (newPassword) formData.append("newPassword", newPassword);
      if (profilePicture) formData.append("profilePicture", profilePicture);

      const { data } = await api.put("/api/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao atualizar perfil"
      );
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, setLoadingState)
      .addCase(register.fulfilled, handleAuthSuccess)
      .addCase(register.rejected, handleError)

      .addCase(login.pending, setLoadingState)
      .addCase(login.fulfilled, handleAuthSuccess)
      .addCase(login.rejected, handleError)

      .addCase(getUser.pending, setLoadingState)
      .addCase(getUser.fulfilled, handleUserSuccess)
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        // Se ocorrer um erro 401 na obtenção do usuário, provavelmente o token expirou
        if (
          action.payload?.includes("401") ||
          action.payload?.includes("não autenticado")
        ) {
          state.user = null;
        }
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      });
  },
});

export const { clearErrors } = authSlice.actions;
export default authSlice.reducer;
