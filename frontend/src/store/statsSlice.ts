import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export interface RoleStats {
  role: string;
  total: number;
  active: number;
  rejected: number;
  offer: number;
  ignored: number;
  abandoned: number;
}

interface StatsState {
  roles: RoleStats[];
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  roles: [],
  loading: false,
  error: null,
};

export const fetchRoleStats = createAsyncThunk<RoleStats[]>(
  "stats/fetchRoleStats",
  async () => {
    const response = await api.get("/api/stats/roles");
    return response.data;
  }
);

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoleStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleStats.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoleStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки статистики";
      });
  },
});

export const { clearError } = statsSlice.actions;
export default statsSlice.reducer;
