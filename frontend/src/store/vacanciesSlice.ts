import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export interface Vacancy {
  id: number;
  title: string;
  company: string;
  original_url: string;
  status: string;
  created_at: string;
  stages: Stage[];
}

export interface Stage {
  stage_name: string;
  status: string;
  date: string;
  comment: string;
}

interface VacanciesState {
  items: Vacancy[];
  loading: boolean;
  error: string | null;
}

const initialState: VacanciesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchVacancies = createAsyncThunk<Vacancy[]>(
  "vacancies/fetchVacancies",
  async () => {
    const response = await api.get("/api/vacancies");
    return response.data;
  }
);

export const addVacancy = createAsyncThunk<
  Vacancy,
  {
    url: string;
    recruiter_name?: string;
    recruiter_contact?: string;
    stages: {
      stage_name: string;
      status: string;
      date: string;
      comment?: string;
    }[];
  }
>("vacancies/addVacancy", async (data) => {
  const response = await api.post("/api/vacancies", data);
  return response.data;
});

const vacanciesSlice = createSlice({
  name: "vacancies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacancies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacancies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVacancies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки";
      })
      .addCase(addVacancy.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export default vacanciesSlice.reducer;
