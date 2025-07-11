import React from "react";
import { Question } from "../store/questionsSlice";
import "./QuestionCard.scss";

interface QuestionCardProps {
  question: Question;
  onClick: () => void;
  onDelete?: () => void;
  vacancyTitle?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onClick,
  onDelete,
  vacancyTitle,
}) => {
  const getDifficultyStars = (difficulty: number) => {
    return "★".repeat(difficulty) + "☆".repeat(5 - difficulty);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="question-card" onClick={onClick}>
      <div className="question-card__header">
        <div className="question-card__difficulty">
          <span className="question-card__stars">
            {getDifficultyStars(question.difficulty)}
          </span>
        </div>
      </div>

      <div className="question-card__content">
        <div className="question-card__question">
          {question.question.length > 100
            ? `${question.question.substring(0, 100)}...`
            : question.question}
          {onDelete && (
            <button
              className="question-card__delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Удалить вопрос"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6,19c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V7H6V19z M19,4h-3.5l-1-1h-5l-1,1H5v2h14V4z" />
              </svg>
            </button>
          )}
        </div>

        {question.answer && (
          <div className="question-card__answer">
            {question.answer.length > 150
              ? `${question.answer.substring(0, 150)}...`
              : question.answer}
          </div>
        )}

        {vacancyTitle && (
          <div className="question-card__vacancy">
            <span className="question-card__vacancy-label">Отклик:</span>
            <span className="question-card__vacancy-title">{vacancyTitle}</span>
          </div>
        )}

        {question.tags && question.tags.length > 0 && (
          <div className="question-card__tags">
            {question.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="question-card__tag">
                {tag}
              </span>
            ))}
            {question.tags.length > 3 && (
              <span className="question-card__tag-more">
                +{question.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="question-card__footer">
        {question.created_at && (
          <span className="question-card__date">
            {formatDate(question.created_at)}
          </span>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
