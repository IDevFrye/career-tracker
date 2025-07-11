import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVacancyDetails,
  fetchVacancyQuestions,
  updateVacancy,
  fetchVacancies,
  deleteVacancy,
} from "../store/vacanciesSlice";
import ConfirmModal from "./ConfirmModal";
import { RootState } from "../store";
import "./VacancyModal.scss";
import { StageIcons } from "./VacancyCard";
import EditVacancyModal from "./EditVacancyModal";

const HhIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="12" fill="#D6001C" />
    <text
      x="7"
      y="17"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="bold"
      fontSize="10"
      fill="#fff"
    >
      hh
    </text>
  </svg>
);
const LockOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
    <rect
      x="5"
      y="10"
      width="14"
      height="9"
      rx="2"
      stroke="#1976d2"
      strokeWidth="2"
    />
    <path d="M8 10V7a4 4 0 0 1 8 0" stroke="#1976d2" strokeWidth="2" />
  </svg>
);
const LockClosedIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
    <rect
      x="5"
      y="10"
      width="14"
      height="9"
      rx="2"
      stroke="#1976d2"
      strokeWidth="2"
    />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#1976d2" strokeWidth="2" />
  </svg>
);
const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M17.472 14.382a2 2 0 0 0-2.12-.45l-1.1.44a1 1 0 0 1-1.09-.21l-2.2-2.2a1 1 0 0 1-.21-1.09l.44-1.1a2 2 0 0 0-.45-2.12l-2.2-2.2a2 2 0 0 0-2.83 0l-.7.7c-1.13 1.13-1.13 2.96 0 4.09 2.83 2.83 7.44 7.44 10.27 10.27 1.13 1.13 2.96 1.13 4.09 0l.7-.7a2 2 0 0 0 0-2.83l-2.2-2.2z"
      stroke="#1976d2"
      strokeWidth="1.5"
    />
  </svg>
);
function getMainStatusColor(status: string) {
  switch ((status || "").toLowerCase()) {
    case "активный":
      return "#1976d2";
    case "проигнорированный":
      return "#8e24aa";
    case "заброшенный":
      return "#bdbdbd";
    case "оффер":
      return "#43a047";
    case "отклонённый":
      return "#e53935";
    default:
      return "#bdbdbd";
  }
}
function getStatusColor(status: string) {
  switch ((status || "").toLowerCase()) {
    case "одобрено":
      return "#4caf50";
    case "ожидание":
      return "#9e9e9e";
    case "отправлено":
      return "#2196f3";
    case "отклонено":
      return "#f44336";
    case "игнор":
      return "#483D8B";
    default:
      return "#9e9e9e";
  }
}

interface VacancyModalProps {
  id: number;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const VacancyModal: React.FC<VacancyModalProps> = ({
  id,
  open,
  onClose,
  onEdit,
}) => {
  const dispatch = useDispatch();
  const vacancy = useSelector(
    (state: RootState) => state.vacancies.details?.[id]
  );
  const questions = useSelector(
    (state: RootState) => state.vacancies.questions?.[id] || []
  );
  const loading = useSelector(
    (state: RootState) =>
      state.vacancies.loadingDetails === id ||
      state.vacancies.loadingQuestions === id
  );
  const error = useSelector((state: RootState) =>
    state.vacancies.errorDetails === id ? state.vacancies.error : null
  );
  const [tooltip, setTooltip] = useState<{
    idx: number;
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!open || !id) return;
    dispatch<any>(fetchVacancyDetails(id));
    dispatch<any>(fetchVacancyQuestions(id));
  }, [id, open, dispatch]);

  useEffect(() => {
    const handleClickOutside = () => {
      setTooltip(null);
    };

    const handleScroll = () => {
      setTooltip(null);
    };

    if (tooltip) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("scroll", handleScroll, true);
      return () => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [tooltip]);

  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, []);

  const handleEditSubmit = async (data: {
    title: string;
    status: string;
    recruiter_name?: string;
    recruiter_contact?: string;
    stages: any[];
  }) => {
    try {
      await dispatch<any>(updateVacancy({ id, ...data }));
      setEditModalOpen(false);
      dispatch<any>(fetchVacancyDetails(id));
      dispatch<any>(fetchVacancies());
      localStorage.removeItem("vacancyDetailsCache");
    } catch (error) {
      console.error("Ошибка при обновлении вакансии:", error);
    }
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch<any>(deleteVacancy(id));
      onClose();
      localStorage.removeItem("vacancyDetailsCache");
    } catch (error) {
      console.error("Ошибка при удалении вакансии:", error);
    }
  };

  if (!open) return null;

  const typeIcon =
    vacancy?.type === "Открытая" ? (
      <LockOpenIcon style={{ marginRight: 6 }} />
    ) : (
      <LockClosedIcon style={{ marginRight: 6 }} />
    );
  const role =
    vacancy?.roles && Array.isArray(vacancy.roles) && vacancy.roles.length > 0
      ? vacancy.roles[0]
      : null;
  const skills =
    vacancy?.skills && Array.isArray(vacancy.skills) ? vacancy.skills : [];

  const getLineType = (idx: number) => {
    if (!vacancy?.stages) return "gray";
    const firstDeclinedIdx = vacancy.stages.findIndex(
      (s: any) => (s.status || "").toLowerCase() === "отклонено"
    );
    if (firstDeclinedIdx !== -1) {
      if (idx === firstDeclinedIdx - 1) return "red";
      if (idx >= firstDeclinedIdx) return "dashed";
    }
    const curr = vacancy.stages[idx];
    const next = vacancy.stages[idx + 1];
    if (!next) return "gray";
    if (
      curr.status.toLowerCase() === "одобрено" &&
      next.status.toLowerCase() === "одобрено"
    )
      return "green";
    return "gray";
  };

  return (
    <div className="vacancy-modal__backdrop">
      <div className="vacancy-modal">
        <div className="vacancy-modal__header">
          <div className="vacancy-modal__title-block">
            <div className="vacancy-modal__title-row">
              {typeIcon}
              <h2>{vacancy?.title || "Отклик"}</h2>
              {role && (
                <span className="vacancy-modal__role-badge">{role}</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {vacancy?.status && (
                <div
                  className="vacancy-modal__status-badge"
                  style={{ background: getMainStatusColor(vacancy.status) }}
                >
                  {vacancy.status}
                </div>
              )}
              <a
                href={vacancy?.original_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Открыть на HH.ru"
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                <HhIcon style={{ width: 22, height: 22 }} />
              </a>
            </div>
          </div>
          <button className="vacancy-modal__close" onClick={onClose}>
            &times;
          </button>
        </div>
        {loading || !vacancy ? (
          <div className="vacancy-modal__loading">Загрузка...</div>
        ) : error ? (
          <div className="vacancy-modal__error">{error}</div>
        ) : (
          <div className="vacancy-modal__content">
            <div className="vacancy-modal__main-info">
              <div>
                <b>Компания:</b> {vacancy.company}
              </div>
              <div>
                <b>Тип:</b> {vacancy.type}
              </div>
              <div>
                <b>Зарплата:</b>{" "}
                {vacancy.salary_from && vacancy.salary_to
                  ? `${vacancy.salary_from} – ${vacancy.salary_to} ${
                      vacancy.salary_currency === "RUR"
                        ? "руб."
                        : vacancy.salary_currency
                    }`
                  : "—"}
              </div>
              <div>
                <b>График:</b> {vacancy.work_schedule || "—"}
              </div>
              <div>
                <b>Опыт:</b> {vacancy.experience || "—"}
              </div>
              <div>
                <b>Тип занятости:</b> {vacancy.employment_type || "—"}
              </div>
            </div>
            <div className="vacancy-modal__stages-timeline">
              <b>Стадии:</b>
              {Array.isArray(vacancy.stages) && vacancy.stages.length > 0 ? (
                <div className="stages-timeline">
                  {vacancy.stages.map((stage: any, idx: number) => (
                    <div className="stages-timeline__item" key={idx}>
                      <div
                        className="stages-timeline__icon"
                        style={{
                          color: getStatusColor(stage.status),
                          position: "relative",
                        }}
                        onMouseEnter={(e) => {
                          if (stage.comment) {
                            const element = e.currentTarget;
                            if (tooltipTimerRef.current) {
                              clearTimeout(tooltipTimerRef.current);
                            }
                            tooltipTimerRef.current = setTimeout(() => {
                              if (element && document.contains(element)) {
                                const rect = element.getBoundingClientRect();
                                setTooltip({
                                  idx,
                                  text: stage.comment,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top - 10,
                                });
                              }
                            }, 300);
                          }
                        }}
                        onMouseLeave={() => {
                          if (tooltipTimerRef.current) {
                            clearTimeout(tooltipTimerRef.current);
                            tooltipTimerRef.current = null;
                          }
                          setTooltip(null);
                        }}
                      >
                        <span>
                          {StageIcons[stage.icon as keyof typeof StageIcons] ||
                            StageIcons["Книжка"]}
                        </span>
                      </div>
                      <div className="stages-timeline__content">
                        <div className="stages-timeline__name">
                          {stage.stage_name}
                        </div>
                        <div className="stages-timeline__meta">
                          <span
                            className="stages-timeline__status"
                            style={{ color: getStatusColor(stage.status) }}
                          >
                            {stage.status}
                          </span>
                          {stage.date && (
                            <span className="stages-timeline__date">
                              {new Date(stage.date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      {idx < vacancy.stages.length - 1 && (
                        <div
                          className={`stages-timeline__line stages-timeline__line--${getLineType(
                            idx
                          )}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                "—"
              )}
            </div>
            {vacancy.recruiter_name && (
              <div className="vacancy-modal__recruiter-block">
                <div className="vacancy-modal__recruiter-row1">
                  <PhoneIcon style={{ marginRight: 6 }} />
                  <span>{vacancy.recruiter_name}</span>
                </div>
                <div className="vacancy-modal__recruiter-row2">
                  {vacancy.recruiter_contact && (
                    <span>{vacancy.recruiter_contact}</span>
                  )}
                  {vacancy.recruiter_phone && (
                    <span>{vacancy.recruiter_phone}</span>
                  )}
                  {vacancy.recruiter_email && (
                    <span>{vacancy.recruiter_email}</span>
                  )}
                </div>
              </div>
            )}
            <div className="vacancy-modal__questions">
              <b>Вопросы:</b>
              <div className="vacancy-modal__questions-list">
                {questions.length > 0 ? (
                  questions.map((q: any, idx: number) => (
                    <div className="vacancy-modal__question-card" key={q.id}>
                      <div className="vacancy-modal__question-top">
                        <span className="vacancy-modal__question-diff">
                          {Array(q.difficulty).fill("★").join("")}
                        </span>
                        <span className="vacancy-modal__question-tags">
                          {q.tags &&
                            q.tags.map((tag: string, i: number) => (
                              <span
                                className="vacancy-modal__question-tag"
                                key={i}
                              >
                                {tag}
                              </span>
                            ))}
                        </span>
                      </div>
                      <div className="vacancy-modal__question-q">
                        {q.question}
                      </div>
                      <div className="vacancy-modal__question-a">
                        {q.answer}
                      </div>
                    </div>
                  ))
                ) : (
                  <span style={{ color: "#888" }}>—</span>
                )}
              </div>
            </div>
            {skills.length > 0 && (
              <div className="vacancy-modal__skills">
                <b>Скиллы:</b>
                <div className="vacancy-modal__skills-list">
                  {skills.map((skill: string, idx: number) => (
                    <span className="vacancy-modal__skill-badge" key={idx}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="vacancy-modal__actions">
          <button
            className="vacancy-modal__edit-btn"
            onClick={() => setEditModalOpen(true)}
          >
            Редактировать
          </button>
          <button className="vacancy-modal__delete-btn" onClick={handleDelete}>
            Удалить
          </button>
        </div>
      </div>
      {tooltip && (
        <div
          className="stages-timeline__tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
      <EditVacancyModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        vacancy={
          vacancy
            ? {
                id,
                title: vacancy.title,
                status: vacancy.status,
                recruiter_name: vacancy.recruiter_name,
                recruiter_contact: vacancy.recruiter_contact,
                stages: vacancy.stages || [],
              }
            : null
        }
      />
      <ConfirmModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Удалить отклик"
        message="Вы уверены, что хотите удалить этот отклик? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        type="danger"
      />
    </div>
  );
};

export default VacancyModal;
