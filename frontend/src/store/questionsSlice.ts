import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export interface Question {
  id: number;
  application_id: number;
  question: string;
  answer: string;
  tags: string[];
  difficulty: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuestionRequest {
  application_id: number;
  question: string;
  answer: string;
  tags: string[];
  difficulty: number;
}

export interface QuestionUpdate {
  application_id?: number;
  question?: string;
  answer?: string;
  tags?: string[];
  difficulty?: number;
}

interface QuestionsState {
  items: Question[];
  loading: boolean;
  error: string | null;
  details: { [id: number]: Question } | null;
  loadingDetails: number | null;
  errorDetails: number | null;
}

const initialState: QuestionsState = {
  items: [],
  loading: false,
  error: null,
  details: null,
  loadingDetails: null,
  errorDetails: null,
};

export const fetchQuestions = createAsyncThunk<Question[]>(
  "questions/fetchQuestions",
  async () => {
    const response = await api.get("/api/questions");
    return response.data;
  }
);

export const fetchQuestionDetails = createAsyncThunk<Question, number>(
  "questions/fetchQuestionDetails",
  async (id) => {
    const response = await api.get(`/api/questions/${id}`);
    return response.data;
  }
);

export const addQuestion = createAsyncThunk<number, QuestionRequest>(
  "questions/addQuestion",
  async (data) => {
    const response = await api.post("/api/questions", data);
    return response.data.id;
  }
);

export const updateQuestion = createAsyncThunk<
  Question,
  { id: number; data: QuestionUpdate }
>("questions/updateQuestion", async ({ id, data }) => {
  await api.put(`/api/questions/${id}`, data);
  const response = await api.get(`/api/questions/${id}`);
  return response.data;
});

export const deleteQuestion = createAsyncThunk<number, number>(
  "questions/deleteQuestion",
  async (id) => {
    await api.delete(`/api/questions/${id}`);
    return id;
  }
);

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки вопросов";
      })
      .addCase(fetchQuestionDetails.pending, (state, action) => {
        state.loadingDetails = action.meta.arg;
        state.errorDetails = null;
      })
      .addCase(fetchQuestionDetails.fulfilled, (state, action) => {
        state.loadingDetails = null;
        if (!state.details) {
          state.details = {};
        }
        state.details[action.payload.id] = action.payload;
      })
      .addCase(fetchQuestionDetails.rejected, (state, action) => {
        state.loadingDetails = null;
        state.errorDetails = action.meta.arg;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        if (state.details) {
          state.details[action.payload.id] = action.payload;
        }
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.details) {
          delete state.details[action.payload];
        }
      });
  },
});

export const { clearError } = questionsSlice.actions;
export default questionsSlice.reducer;
