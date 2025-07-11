import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionDetails } from "../store/questionsSlice";
import { fetchVacancyDetails } from "../store/vacanciesSlice";
import { RootState, AppDispatch } from "../store";
import ConfirmModal from "./ConfirmModal";
import EditQuestionModal from "./EditQuestionModal";
import "./QuestionModal.scss";

interface QuestionModalProps {
  id: number;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  id,
  open,
  onClose,
  onEdit,
  onDelete,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const question = useSelector(
    (state: RootState) => state.questions.details?.[id]
  );
  const loading = useSelector(
    (state: RootState) => state.questions.loadingDetails === id
  );
  const error = useSelector(
    (state: RootState) => state.questions.errorDetails === id
  );

  const vacancy = useSelector((state: RootState) =>
    question ? state.vacancies.details?.[question.application_id] : null
  );

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (open && id) {
      dispatch(fetchQuestionDetails(id));
    }
  }, [id, open, dispatch]);

  useEffect(() => {
    if (question && !vacancy) {
      dispatch(fetchVacancyDetails(question.application_id));
    }
  }, [question, vacancy, dispatch]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete();
    }
    setDeleteConfirmOpen(false);
    onClose();
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    if (id) {
      dispatch(fetchQuestionDetails(id));
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return "★".repeat(difficulty) + "☆".repeat(5 - difficulty);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!open) return null;

  return (
    <div className="question-modal-overlay" onClick={handleBackdropClick}>
      <div className="question-modal">
        <div className="question-modal__header">
          <h2>Детали вопроса</h2>
          <button
            className="question-modal__close-btn"
            onClick={onClose}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="question-modal__content">
          {loading ? (
            <div className="question-modal__loading">Загрузка...</div>
          ) : error ? (
            <div className="question-modal__error">Ошибка загрузки вопроса</div>
          ) : question ? (
            <>
              <div className="question-modal__meta">
                <div className="question-modal__meta-item">
                  <span className="question-modal__meta-label">Сложность:</span>
                  <span className="question-modal__meta-value">
                    <span className="question-modal__stars">
                      {getDifficultyStars(question.difficulty)}
                    </span>
                    <span className="question-modal__difficulty-text">
                      {question.difficulty === 1 && "Очень легко"}
                      {question.difficulty === 2 && "Легко"}
                      {question.difficulty === 3 && "Средне"}
                      {question.difficulty === 4 && "Сложно"}
                      {question.difficulty === 5 && "Очень сложно"}
                    </span>
                  </span>
                </div>

                {question.created_at && (
                  <div className="question-modal__meta-item">
                    <span className="question-modal__meta-label">Создан:</span>
                    <span className="question-modal__meta-value">
                      {formatDate(question.created_at)}
                    </span>
                  </div>
                )}

                {question.updated_at &&
                  question.updated_at !== question.created_at && (
                    <div className="question-modal__meta-item">
                      <span className="question-modal__meta-label">
                        Обновлен:
                      </span>
                      <span className="question-modal__meta-value">
                        {formatDate(question.updated_at)}
                      </span>
                    </div>
                  )}
              </div>

              {vacancy && (
                <div className="question-modal__vacancy">
                  <h3 className="question-modal__section-title">
                    Связанный отклик
                  </h3>
                  <div className={`question-modal__vacancy-card`}>
                    <div className="question-modal__vacancy-title">
                      {vacancy.title}
                    </div>
                    <div className="question-modal__vacancy-company">
                      {vacancy.company}
                    </div>
                    {vacancy.status && (
                      <div className="question-modal__vacancy-status">
                        Статус:{" "}
                        <span
                          className={`status-${vacancy.status.toLowerCase()}`}
                        >
                          {vacancy.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="question-modal__section">
                <h3 className="question-modal__section-title">Вопрос</h3>
                <div className="question-modal__question-text">
                  {question.question}
                </div>
              </div>

              <div className="question-modal__section">
                <h3 className="question-modal__section-title">Ответ</h3>
                <div className="question-modal__answer-text">
                  {question.answer}
                </div>
              </div>

              {question.tags && question.tags.length > 0 && (
                <div className="question-modal__section">
                  <h3 className="question-modal__section-title">Теги</h3>
                  <div className="question-modal__tags">
                    {question.tags.map((tag, index) => (
                      <span key={index} className="question-modal__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="question-modal__error">Вопрос не найден</div>
          )}
        </div>

        <div className="question-modal__actions">
          <button
            className="question-modal__btn question-modal__btn--edit"
            onClick={handleEdit}
          >
            Редактировать
          </button>
          {onDelete && (
            <button
              className="question-modal__btn question-modal__btn--delete"
              onClick={handleDelete}
            >
              Удалить
            </button>
          )}
        </div>

        <ConfirmModal
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Удалить вопрос"
          message="Вы уверены, что хотите удалить этот вопрос? Это действие нельзя отменить."
          confirmText="Удалить"
          cancelText="Отмена"
          type="danger"
        />

        <EditQuestionModal
          id={id}
          open={editModalOpen}
          onClose={handleEditClose}
        />
      </div>
    </div>
  );
};

export default QuestionModal;
