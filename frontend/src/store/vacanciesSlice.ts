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
  details?: { [id: number]: any };
  questions?: { [id: number]: any[] };
  loadingDetails?: number | null;
  loadingQuestions?: number | null;
  errorDetails?: number | null;
}

const initialState: VacanciesState = {
  items: [],
  loading: false,
  error: null,
  details: {},
  questions: {},
  loadingDetails: null,
  loadingQuestions: null,
  errorDetails: null,
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

export const fetchVacancyDetails = createAsyncThunk<any, number>(
  "vacancies/fetchVacancyDetails",
  async (id) => {
    const response = await api.get(`/api/vacancies/${id}`);
    return { id, details: response.data };
  }
);

export const fetchVacancyQuestions = createAsyncThunk<any, number>(
  "vacancies/fetchVacancyQuestions",
  async (id) => {
    const response = await api.get(`/api/vacancies/${id}/questions`);
    return { id, questions: response.data };
  }
);

export const updateVacancy = createAsyncThunk<
  any,
  {
    id: number;
    title: string;
    status: string;
    recruiter_name?: string;
    recruiter_contact?: string;
    stages: {
      stage_name: string;
      status: string;
      date: string;
      comment?: string;
      icon?: string;
    }[];
  }
>("vacancies/updateVacancy", async (data) => {
  const response = await api.put(`/api/vacancies/${data.id}`, data);
  return response.data;
});

export const deleteVacancy = createAsyncThunk<number, number>(
  "vacancies/deleteVacancy",
  async (id) => {
    await api.delete(`/api/vacancies/${id}`);
    return id;
  }
);

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
      })
      .addCase(fetchVacancyDetails.pending, (state, action) => {
        state.loadingDetails = action.meta.arg;
        state.errorDetails = null;
      })
      .addCase(fetchVacancyDetails.fulfilled, (state, action) => {
        state.loadingDetails = null;
        state.details = {
          ...state.details,
          [action.payload.id]: action.payload.details,
        };
      })
      .addCase(fetchVacancyDetails.rejected, (state, action) => {
        state.loadingDetails = null;
        state.errorDetails = action.meta.arg;
        state.error = action.error.message || "Ошибка загрузки деталей";
      })
      .addCase(fetchVacancyQuestions.pending, (state, action) => {
        state.loadingQuestions = action.meta.arg;
      })
      .addCase(fetchVacancyQuestions.fulfilled, (state, action) => {
        state.loadingQuestions = null;
        state.questions = {
          ...state.questions,
          [action.payload.id]: action.payload.questions,
        };
      })
      .addCase(fetchVacancyQuestions.rejected, (state, action) => {
        state.loadingQuestions = null;
      })
      .addCase(updateVacancy.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Обновляем детали вакансии
        if (state.details) {
          state.details[action.payload.id] = action.payload;
        }
      })
      .addCase(deleteVacancy.fulfilled, (state, action) => {
        // Удаляем вакансию из списка
        state.items = state.items.filter((item) => item.id !== action.payload);
        // Удаляем детали вакансии из кэша
        if (state.details) {
          delete state.details[action.payload];
        }
        // Удаляем вопросы вакансии из кэша
        if (state.questions) {
          delete state.questions[action.payload];
        }
      });
  },
});

export default vacanciesSlice.reducer;
