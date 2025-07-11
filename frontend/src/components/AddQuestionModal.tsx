import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addQuestion, fetchQuestions } from "../store/questionsSlice";
import { fetchVacancies } from "../store/vacanciesSlice";
import { RootState, AppDispatch } from "../store";
import "./AddQuestionModal.scss";

interface AddQuestionModalProps {
  open: boolean;
  onClose: () => void;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
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

    // Очищаем ошибку при изменении поля
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(
        addQuestion({
          application_id: Number(formData.application_id),
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          tags: tags,
          difficulty: formData.difficulty,
        })
      );

      // Обновляем список вопросов
      dispatch(fetchQuestions());

      // Сбрасываем форму
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

      onClose();
    } catch (error) {
      console.error("Ошибка при добавлении вопроса:", error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="add-question-modal-overlay" onClick={handleBackdropClick}>
      <div className="add-question-modal">
        <div className="add-question-modal__header">
          <h2>Добавить вопрос</h2>
          <button
            className="add-question-modal__close-btn"
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

        <form onSubmit={handleSubmit} className="add-question-modal__form">
          <div className="add-question-modal__field">
            <label
              htmlFor="application_id"
              className="add-question-modal__label"
            >
              Отклик *
            </label>
            <select
              id="application_id"
              name="application_id"
              value={formData.application_id}
              onChange={handleInputChange}
              className={`add-question-modal__select ${
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
              <span className="add-question-modal__error">
                {errors.application_id}
              </span>
            )}
          </div>

          <div className="add-question-modal__field">
            <label htmlFor="question" className="add-question-modal__label">
              Вопрос *
            </label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              placeholder="Введите вопрос..."
              rows={3}
              className={`add-question-modal__textarea ${
                errors.question ? "error" : ""
              }`}
            />
            {errors.question && (
              <span className="add-question-modal__error">
                {errors.question}
              </span>
            )}
          </div>

          <div className="add-question-modal__field">
            <label htmlFor="answer" className="add-question-modal__label">
              Ответ *
            </label>
            <textarea
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              placeholder="Введите ответ..."
              rows={4}
              className={`add-question-modal__textarea ${
                errors.answer ? "error" : ""
              }`}
            />
            {errors.answer && (
              <span className="add-question-modal__error">{errors.answer}</span>
            )}
          </div>

          <div className="add-question-modal__field">
            <label htmlFor="tags" className="add-question-modal__label">
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
              className="add-question-modal__input"
            />
            <span className="add-question-modal__hint">
              Введите тег и нажмите Enter для добавления
            </span>

            {/* Отображение добавленных тегов */}
            {tags.length > 0 && (
              <div className="add-question-modal__tags">
                {tags.map((tag, index) => (
                  <span key={index} className="add-question-modal__tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="add-question-modal__tag-remove"
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

          <div className="add-question-modal__field">
            <label htmlFor="difficulty" className="add-question-modal__label">
              Сложность
            </label>
            <div className="add-question-modal__difficulty">
              <div className="add-question-modal__stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="add-question-modal__star-btn"
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
              <div className="add-question-modal__difficulty-display">
                <span className="add-question-modal__difficulty-text">
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

          <div className="add-question-modal__actions">
            <button
              type="button"
              onClick={onClose}
              className="add-question-modal__btn add-question-modal__btn--cancel"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="add-question-modal__btn add-question-modal__btn--submit"
              disabled={loading}
            >
              {loading ? "Добавление..." : "Добавить вопрос"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;
