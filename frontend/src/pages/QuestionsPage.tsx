import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions, deleteQuestion } from "../store/questionsSlice";
import { fetchVacancyDetails } from "../store/vacanciesSlice";
import { RootState, AppDispatch } from "../store";
import QuestionCard from "../components/QuestionCard";
import ConfirmModal from "../components/ConfirmModal";
import AddQuestionModal from "../components/AddQuestionModal";
import QuestionModal from "../components/QuestionModal";
import "./QuestionsPage.scss";

const QuestionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: questions,
    loading,
    error,
  } = useSelector((state: RootState) => state.questions);
  const { details: vacancyDetails, items: vacancies } = useSelector(
    (state: RootState) => state.vacancies
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "difficulty" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  useEffect(() => {
    const uniqueVacancyIds = [
      ...new Set(questions?.map((q) => q.application_id)),
    ];
    uniqueVacancyIds.forEach((id) => {
      if (!vacancyDetails?.[id]) {
        dispatch(fetchVacancyDetails(id));
      }
    });
  }, [questions, vacancyDetails, dispatch]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    questions?.forEach((question) => {
      question.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [questions]);

  const allVacancies = useMemo(() => {
    const vacancyIds = [...new Set(questions?.map((q) => q.application_id))];
    return vacancyIds.map((id) => ({
      id,
      title: vacancyDetails?.[id]?.title || `Отклик #${id}`,
    }));
  }, [questions, vacancyDetails]);

  const filteredAndSortedQuestions = useMemo(() => {
    let filtered = questions?.filter((question) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = question.question.toLowerCase().includes(query);
        const matchesAnswer =
          question.answer?.toLowerCase().includes(query) || false;
        const matchesTags =
          question.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          false;

        if (!matchesQuestion && !matchesAnswer && !matchesTags) {
          return false;
        }
      }

      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some((tag) =>
          question.tags?.includes(tag)
        );
        if (!hasSelectedTag) return false;
      }

      if (selectedVacancy !== null) {
        if (question.application_id !== selectedVacancy) {
          return false;
        }
      }

      return true;
    });

    filtered?.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        case "difficulty":
          aValue = a.difficulty;
          bValue = b.difficulty;
          break;
        case "title":
          aValue = a.question.toLowerCase();
          bValue = b.question.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    questions,
    searchQuery,
    selectedTags,
    selectedVacancy,
    sortBy,
    sortOrder,
  ]);

  const handleDeleteQuestion = (id: number) => {
    setQuestionToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (questionToDelete) {
      try {
        await dispatch(deleteQuestion(questionToDelete));
      } catch (error) {
        console.error("Ошибка при удалении вопроса:", error);
      }
    }
    setDeleteConfirmOpen(false);
    setQuestionToDelete(null);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedVacancy(null);
  };

  return (
    <div className="questions-page">
      <div className="questions-page__header">
        <h1>Вопросы и заметки</h1>
        <button
          className="questions-page__add-btn"
          onClick={() => setAddModalOpen(true)}
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h14m-7 7V5"
            />
          </svg>
          Добавить вопрос
        </button>
      </div>

      <div className="questions-page__filters">
        <div className="questions-page__search">
          <input
            type="text"
            placeholder="Поиск по вопросу, ответу или тегам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="questions-page__search-input"
          />
        </div>

        <div className="questions-page__filter-controls">
          <div className="questions-page__filter-group">
            <label>Сортировка:</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split("-") as [any, any];
                setSortBy(sort);
                setSortOrder(order);
              }}
              className="questions-page__select"
            >
              <option value="date-desc">Дата (новые)</option>
              <option value="date-asc">Дата (старые)</option>
              <option value="difficulty-desc">Сложность (высокая)</option>
              <option value="difficulty-asc">Сложность (низкая)</option>
              <option value="title-asc">Название (А-Я)</option>
              <option value="title-desc">Название (Я-А)</option>
            </select>
          </div>

          <div className="questions-page__filter-group">
            <label>Отклик:</label>
            <select
              value={selectedVacancy || ""}
              onChange={(e) =>
                setSelectedVacancy(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="questions-page__select"
            >
              <option value="">Все отклики</option>
              {allVacancies.map((vacancy) => (
                <option key={vacancy.id} value={vacancy.id}>
                  {vacancy.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="questions-page__clear-btn"
            disabled={
              !searchQuery &&
              selectedTags.length === 0 &&
              selectedVacancy === null
            }
          >
            Очистить фильтры
          </button>
        </div>

        {allTags.length > 0 && (
          <div className="questions-page__tags-filter">
            <label>Теги:</label>
            <div className="questions-page__tags-list">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`questions-page__tag-btn ${
                    selectedTags.includes(tag) ? "active" : ""
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="questions-page__content">
        {loading ? (
          <div className="questions-page__loading">Загрузка вопросов...</div>
        ) : error ? (
          <div className="questions-page__error">{error}</div>
        ) : !vacancies || vacancies.length === 0 ? (
          <div className="questions-page__empty">
            <div className="questions-page__empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="questions-page__empty-title">Нет откликов</h3>
            <p className="questions-page__empty-description">
              Чтобы добавлять вопросы, сначала создайте хотя бы один отклик на
              вакансию.
            </p>
            <button
              className="questions-page__empty-btn"
              onClick={() => {
                window.location.href = "/";
                setTimeout(() => {
                  const addBtn = document.querySelector(
                    ".add-vacancy-btn"
                  ) as HTMLElement;
                  if (addBtn) addBtn.click();
                }, 500);
              }}
            >
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h14m-7 7V5"
                />
              </svg>
              Добавить отклик
            </button>
          </div>
        ) : !questions || questions.length === 0 ? (
          <div className="questions-page__empty">
            <div className="questions-page__empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="questions-page__empty-title">Вопросов пока нет</h3>
            <p className="questions-page__empty-description">
              Добавьте первый вопрос, чтобы начать собирать свою базу знаний для
              будущих интервью!
            </p>
            <button
              className="questions-page__empty-btn"
              onClick={() => setAddModalOpen(true)}
            >
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h14m-7 7V5"
                />
              </svg>
              Добавить вопрос
            </button>
          </div>
        ) : filteredAndSortedQuestions?.length === 0 ? (
          <div className="questions-page__empty">
            <div className="questions-page__empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="questions-page__empty-title">Ничего не найдено</h3>
            <p className="questions-page__empty-description">
              По вашему запросу ничего не найдено. Попробуйте изменить фильтры
              или поисковый запрос.
            </p>
            <button
              className="questions-page__empty-btn"
              onClick={clearFilters}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Очистить фильтры
            </button>
          </div>
        ) : (
          <>
            <div className="questions-page__stats">
              {filteredAndSortedQuestions &&
                questions &&
                `Показано${" "}
              ${filteredAndSortedQuestions?.length} из ${questions?.length}{" "}
              вопросов`}
            </div>
            <div className="questions-page__grid">
              {filteredAndSortedQuestions?.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onClick={() => setSelectedQuestionId(question.id)}
                  onDelete={() => handleDeleteQuestion(question.id)}
                  vacancyTitle={
                    vacancyDetails?.[question.application_id]?.title
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setQuestionToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Удалить вопрос"
        message="Вы уверены, что хотите удалить этот вопрос? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        type="danger"
      />
      <AddQuestionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      <QuestionModal
        id={selectedQuestionId ?? 0}
        open={selectedQuestionId !== null}
        onClose={() => setSelectedQuestionId(null)}
        onDelete={() => {
          if (selectedQuestionId) {
            handleDeleteQuestion(selectedQuestionId);
          }
        }}
      />
    </div>
  );
};

export default QuestionsPage;
