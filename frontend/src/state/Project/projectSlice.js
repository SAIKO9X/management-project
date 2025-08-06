import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import api from "@/config/api";

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/projects", { params });
      return Array.isArray(data) ? data : data.projects || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao buscar projetos"
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (projectId, { rejectWithValue }) => {
    try {
      if (!projectId || isNaN(projectId)) {
        return rejectWithValue("ID do projeto inválido");
      }

      const response = await api.get(`/api/projects/${projectId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erro ao buscar projeto"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/projects", projectData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao criar projeto"
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async ({ projectId }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/projects/${projectId}`);
      return projectId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao deletar projeto"
      );
    }
  }
);

export const searchProjects = createAsyncThunk(
  "projects/search",
  async (keyword, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/projects/search?keyword=${keyword}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao buscar projetos"
      );
    }
  }
);

export const inviteToProject = createAsyncThunk(
  "projects/invite",
  async ({ email, projectId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/projects/invite", {
        email,
        projectId,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Erro ao convidar");
    }
  }
);

export const acceptInvitation = createAsyncThunk(
  "projects/acceptInvite",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/projects/accept_invitation", {
        params: { token },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao aceitar convite"
      );
    }
  }
);

export const fetchUserTags = createAsyncThunk(
  "projects/fetchTags",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/tags");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao buscar tags"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProjects",
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(
        `/api/projects/${projectId}`,
        projectData
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao atualizar projeto"
      );
    }
  }
);

export const fetchUserCategories = createAsyncThunk(
  "projects/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/categories");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao buscar categorias"
      );
    }
  }
);

export const createTag = createAsyncThunk(
  "projects/createTag",
  async (tagData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/tags", tagData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao criar tag"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "projects/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/categories", categoryData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao criar categoria"
      );
    }
  }
);

export const updateTag = createAsyncThunk(
  "projects/updateTag",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/tags/${id}`, { name });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao atualizar tag"
      );
    }
  }
);

export const deleteTag = createAsyncThunk(
  "projects/deleteTag",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/tags/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao deletar tag"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "projects/updateCategory",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/categories/${id}`, { name });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao atualizar categoria"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "projects/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/categories/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erro ao deletar categoria"
      );
    }
  }
);

const initialState = {
  projects: [],
  projectDetails: null,
  selectedProject: null,
  searchProjects: [],
  userTags: [],
  userCategories: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    selectProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        console.log("fetchProjects payload:", action.payload);
        console.log(
          "Tipo do payload:",
          Array.isArray(action.payload) ? "Array" : typeof action.payload
        );
        state.projects = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.projectDetails = action.payload;
        state.selectedProject = action.payload; // Also update selectedProject when fetching by ID
        state.loading = false;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        console.log("createProject payload:", action.payload);
        state.projects.push(action.payload);
        state.loading = false;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);

        if (
          state.selectedProject &&
          state.selectedProject.id === action.payload
        ) {
          state.selectedProject = null;
        }
        state.loading = false;
      })
      .addCase(searchProjects.fulfilled, (state, action) => {
        state.searchProjects = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserTags.fulfilled, (state, action) => {
        state.userTags = action.payload;
        state.loading = false;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.projects = state.projects.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );

        if (state.projectDetails?.id === action.payload.id) {
          state.projectDetails = action.payload;
        }
        if (state.selectedProject?.id === action.payload.id) {
          state.selectedProject = action.payload;
        }
        state.loading = false;
      })
      .addCase(fetchUserCategories.fulfilled, (state, action) => {
        state.userCategories = action.payload;
        state.loading = false;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.userTags.push(action.payload);
        state.loading = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.userCategories.push(action.payload);
        state.loading = false;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        const index = state.userTags.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.userTags[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.userTags = state.userTags.filter((t) => t.id !== action.payload);
        state.loading = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.userCategories.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.userCategories[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.userCategories = state.userCategories.filter(
          (c) => c.id !== action.payload
        );
        state.loading = false;
      })
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectProject, clearSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;
