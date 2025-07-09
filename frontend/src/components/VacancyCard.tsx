import React, { useState } from "react";
import { Vacancy } from "../store/vacanciesSlice";
import "./VacancyCard.scss";

interface VacancyCardProps {
  vacancy: Vacancy;
  onClick: () => void;
}

export const StageIcons = {
  Книжка: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 7H20" />
      <rect x="4" y="2" width="16" height="20" rx="2.5" />
    </svg>
  ),
  Карандаш: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  ),
  Шестерёнка: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 9 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Медаль: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Календарь: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  ),
  Телефон: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Человек: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M2 20c0-4 8-6 10-6s10 2 10 6" />
    </svg>
  ),
  Куб: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Карта: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  Компьютер: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  ),
};

const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy, onClick }) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const maxVisibleStages = 3;
  const safeStages = Array.isArray(vacancy.stages) ? vacancy.stages : [];
  const totalStages = safeStages.length;
  const canScrollLeft = scrollIndex > 0;
  const canScrollRight = scrollIndex + maxVisibleStages < totalStages;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getStageIcon = (stage: any) => {
    const iconName = stage.icon || "Книжка";
    return (
      StageIcons[iconName as keyof typeof StageIcons] || StageIcons["Книжка"]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "отправлено":
        return "#4caf50";
      case "ожидание":
        return "#ff9800";
      case "одобрено":
        return "#2196f3";
      case "отклонено":
        return "#f44336";
      case "игнор":
        return "#483D8B";
      default:
        return "#9e9e9e";
    }
  };

  const scrollLeft = () => {
    setScrollIndex(Math.max(0, scrollIndex - 1));
  };

  const scrollRight = () => {
    setScrollIndex(Math.min(totalStages - maxVisibleStages, scrollIndex + 1));
  };

  const createdAt = vacancy.created_at ? new Date(vacancy.created_at) : null;
  const createdAtStr =
    createdAt && !isNaN(createdAt.getTime())
      ? createdAt.toLocaleDateString()
      : "—";

  return (
    <div className="vacancy-card" onClick={onClick}>
      <div className="vacancy-card__content">
        <div className="vacancy-card__main">
          <div className="vacancy-card__title">{vacancy.title}</div>
          <div className="vacancy-card__company">{vacancy.company}</div>
          <div className="vacancy-card__status">
            Статус:{" "}
            <span className={`status-${vacancy.status}`}>
              {vacancy.status === "active" ? "Активный" : vacancy.status}
            </span>
          </div>
          <div className="vacancy-card__meta">
            <span>Создан: {createdAtStr}</span>
          </div>
          {vacancy.original_url && (
            <div className="vacancy-card__link">
              <a
                href={vacancy.original_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hh-link"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14,3V7H17.59L7.76,16.83L9.17,18.24L19,8.41V12H21V3M19,19H5V5H12V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                </svg>
                Открыть на HH.ru
              </a>
            </div>
          )}
        </div>

        <div className="vacancy-card__stages">
          {canScrollLeft && (
            <button
              className="stage-scroll-btn stage-scroll-left"
              onClick={(e) => {
                e.stopPropagation();
                scrollLeft();
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
              </svg>
            </button>
          )}

          <div className="stages-container">
            {safeStages.length > 0 ? (
              safeStages
                .slice(scrollIndex, scrollIndex + maxVisibleStages)
                .map((stage, idx) => (
                  <div key={scrollIndex + idx} className="stage-item">
                    <div
                      className="stage-icon"
                      style={{ color: getStatusColor(stage.status) }}
                    >
                      {getStageIcon(stage)}
                    </div>
                    <div className="stage-info">
                      <div className="stage-name">{stage.stage_name}</div>
                      <div className="stage-date">{formatDate(stage.date)}</div>
                      <div
                        className="stage-status"
                        style={{ color: getStatusColor(stage.status) }}
                      >
                        {stage.status}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="vacancycard__no-stages">
                Добавьте стадии отклика для отслеживания прогресса
              </div>
            )}
          </div>

          {canScrollRight && (
            <button
              className="stage-scroll-btn stage-scroll-right"
              onClick={(e) => {
                e.stopPropagation();
                scrollRight();
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VacancyCard;
