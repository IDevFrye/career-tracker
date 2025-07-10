import { configureStore } from "@reduxjs/toolkit";
import vacanciesReducer from "./vacanciesSlice";
import questionsReducer from "./questionsSlice";
import statsReducer from "./statsSlice";

export const store = configureStore({
  reducer: {
    vacancies: vacanciesReducer,
    questions: questionsReducer,
    stats: statsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
