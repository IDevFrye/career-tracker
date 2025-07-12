import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateQuestion, fetchQuestions } from "../store/questionsSlice";
import { fetchVacancies } from "../store/vacanciesSlice";
import { RootState, AppDispatch } from "../store";
import "./EditQuestionModal.scss";

interface EditQuestionModalProps {
  id: number;
  open: boolean;
  onClose: () => void;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  id,
  open,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const question = useSelector(
    (state: RootState) => state.questions.details?.[id]
  );
  const vacancies = useSelector((state: RootState) => state.vacancies.items);
  const loading = useSelector((state: RootState) => state.questions.loading);

  const [formData, setFormData] = useState({
    application_id: "",
    question: "",
    answer: "",
    tags: "",
    difficulty: 3,
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [hoveredDifficulty, setHoveredDifficulty] = useState(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (open) {
      dispatch(fetchVacancies());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (question) {
      setFormData({
        application_id: question.application_id.toString(),
        question: question.question,
        answer: question.answer,
        tags: question.tags?.join(", ") || "",
        difficulty: question.difficulty,
      });
      setTags(question.tags || []);
    }
  }, [question]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleDifficultyChange = (difficulty: number) => {
    setFormData((prev) => ({
      ...prev,
      difficulty,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.application_id) {
      newErrors.application_id = "Выберите отклик";
    }

    if (!formData.question.trim()) {
      newErrors.question = "Введите вопрос";
    } else if (formData.question.trim().length < 10) {
      newErrors.question = "Вопрос должен содержать минимум 10 символов";
    }

    if (!formData.answer.trim()) {
      newErrors.answer = "Введите ответ";
    } else if (formData.answer.trim().length < 10) {
      newErrors.answer = "Ответ должен содержать минимум 10 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Функция для сброса формы
  const resetForm = () => {
    setFormData({
      application_id: "",
      question: "",
      answer: "",
      tags: "",
      difficulty: 3,
    });
    setTags([]);
    setTagInput("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(
        updateQuestion({
          id,
          data: {
            application_id: formData.application_id
              ? Number(formData.application_id)
              : undefined,
            question: formData.question.trim(),
            answer: formData.answer.trim(),
            tags: tags,
            difficulty: formData.difficulty,
          },
        })
      );

      // Обновляем список вопросов
      dispatch(fetchQuestions());

      resetForm();
      onClose();
    } catch (error) {
      // Можно оставить console.error для ошибок, но если нужно убрать - закомментируй
      // console.error("Ошибка при обновлении вопроса:", error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      resetForm();
      onClose();
    }
  };

  if (!open || !question) return null;

  return (
    <div className="edit-question-modal-overlay" onClick={handleBackdropClick}>
      <div className="edit-question-modal">
        <div className="edit-question-modal__header">
          <h2>Редактировать вопрос</h2>
          <button
            className="edit-question-modal__close-btn"
            onClick={() => {
              resetForm();
              onClose();
            }}
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

        <form onSubmit={handleSubmit} className="edit-question-modal__form">
          <div className="edit-question-modal__field">
            <label
              htmlFor="application_id"
              className="edit-question-modal__label"
            >
              Отклик *
            </label>
            <select
              id="application_id"
              name="application_id"
              value={formData.application_id}
              onChange={handleInputChange}
              className={`edit-question-modal__select ${
                errors.application_id ? "error" : ""
              }`}
            >
              <option value="">Выберите отклик</option>
              {vacancies.map((vacancy) => (
                <option key={vacancy.id} value={vacancy.id}>
                  {vacancy.title} - {vacancy.company}
                </option>
              ))}
            </select>
            {errors.application_id && (
              <span className="edit-question-modal__error">
                {errors.application_id}
              </span>
            )}
          </div>

          <div className="edit-question-modal__field">
            <label htmlFor="question" className="edit-question-modal__label">
              Вопрос *
            </label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              placeholder="Введите вопрос..."
              rows={3}
              className={`edit-question-modal__textarea ${
                errors.question ? "error" : ""
              }`}
            />
            {errors.question && (
              <span className="edit-question-modal__error">
                {errors.question}
              </span>
            )}
          </div>

          <div className="edit-question-modal__field">
            <label htmlFor="answer" className="edit-question-modal__label">
              Ответ *
            </label>
            <textarea
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              placeholder="Введите ответ..."
              rows={4}
              className={`edit-question-modal__textarea ${
                errors.answer ? "error" : ""
              }`}
            />
            {errors.answer && (
              <span className="edit-question-modal__error">
                {errors.answer}
              </span>
            )}
          </div>

          <div className="edit-question-modal__field">
            <label htmlFor="tags" className="edit-question-modal__label">
              Теги
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Введите тег и нажмите Enter"
              className="edit-question-modal__input"
            />
            <span className="edit-question-modal__hint">
              Введите тег и нажмите Enter для добавления
            </span>

            {tags.length > 0 && (
              <div className="edit-question-modal__tags">
                {tags.map((tag, index) => (
                  <span key={index} className="edit-question-modal__tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="edit-question-modal__tag-remove"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M18 6L6 18M6 6L18 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="edit-question-modal__field">
            <label htmlFor="difficulty" className="edit-question-modal__label">
              Сложность
            </label>
            <div className="edit-question-modal__difficulty">
              <div className="edit-question-modal__stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="edit-question-modal__star-btn"
                    onMouseEnter={() => setHoveredDifficulty(star)}
                    onMouseLeave={() => setHoveredDifficulty(0)}
                    onClick={() => handleDifficultyChange(star)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={
                        star <= (hoveredDifficulty || formData.difficulty)
                          ? "#f59e0b"
                          : "none"
                      }
                      stroke="#f59e0b"
                      strokeWidth="2"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
              <div className="edit-question-modal__difficulty-display">
                <span className="edit-question-modal__difficulty-text">
                  {hoveredDifficulty === 1 && "Очень легко"}
                  {hoveredDifficulty === 2 && "Легко"}
                  {hoveredDifficulty === 3 && "Средне"}
                  {hoveredDifficulty === 4 && "Сложно"}
                  {hoveredDifficulty === 5 && "Очень сложно"}
                  {!hoveredDifficulty &&
                    formData.difficulty === 1 &&
                    "Очень легко"}
                  {!hoveredDifficulty && formData.difficulty === 2 && "Легко"}
                  {!hoveredDifficulty && formData.difficulty === 3 && "Средне"}
                  {!hoveredDifficulty && formData.difficulty === 4 && "Сложно"}
                  {!hoveredDifficulty &&
                    formData.difficulty === 5 &&
                    "Очень сложно"}
                </span>
              </div>
            </div>
          </div>

          <div className="edit-question-modal__actions">
            <button
              type="button"
              onClick={onClose}
              className="edit-question-modal__btn edit-question-modal__btn--cancel"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="edit-question-modal__btn edit-question-modal__btn--submit"
              disabled={loading}
            >
              {loading ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionModal;
