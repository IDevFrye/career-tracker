import React, { useState, useEffect } from "react";
import "./EditVacancyModal.scss";
import { StageIcons } from "./VacancyCard";

interface StageForm {
  stage_name: string;
  status: string;
  date: string;
  comment?: string;
  icon?: string;
}

interface RecruiterForm {
  recruiter_name: string;
  recruiter_contact: string;
}

interface EditVacancyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    status: string;
    recruiter_name?: string;
    recruiter_contact?: string;
    stages: StageForm[];
  }) => void;
  vacancy: {
    id: number;
    title: string;
    status: string;
    recruiter_name?: string;
    recruiter_contact?: string;
    stages: StageForm[];
  } | null;
}

const ICONS = [
  { value: "Компьютер", icon: StageIcons["Компьютер"] },
  { value: "Терминал", icon: StageIcons["Терминал"] },
  { value: "Репозиторий", icon: StageIcons["Репозиторий"] },
  { value: "Файл", icon: StageIcons["Файл"] },
  { value: "Тест", icon: StageIcons["Тест"] },
  { value: "Телефон", icon: StageIcons["Телефон"] },
  { value: "Человек", icon: StageIcons["Человек"] },
  { value: "Диалог", icon: StageIcons["Диалог"] },
  { value: "Камера", icon: StageIcons["Камера"] },
  { value: "Резюме", icon: StageIcons["Резюме"] },
  { value: "Книжка", icon: StageIcons["Книжка"] },
  { value: "Карандаш", icon: StageIcons["Карандаш"] },
  { value: "Медаль", icon: StageIcons["Медаль"] },
  { value: "Календарь", icon: StageIcons["Календарь"] },
  { value: "Куб", icon: StageIcons["Куб"] },
];

const STATUS_OPTIONS = [
  { value: "Активный", color: "#3B82F6" },
  { value: "Проигнорированный", color: "#8B5CF6" },
  { value: "Заброшенный", color: "#6B7280" },
  { value: "Оффер", color: "#10B981" },
  { value: "Отклонённый", color: "#EF4444" },
];

const IconPickerGrid = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selectedIcon =
    ICONS.find((i) => i.value === value)?.icon || StageIcons["Книжка"];
  return (
    <div className="icon-picker-grid">
      <button
        type="button"
        className="icon-picker-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Выбрать иконку"
      >
        <span className="icon-picker-btn__icon">{selectedIcon}</span>
      </button>
      {open && (
        <div className="icon-picker-popover">
          {ICONS.map((item, idx) => (
            <button
              type="button"
              key={item.value}
              className={`icon-picker-cell${
                value === item.value ? " selected" : ""
              }`}
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
              tabIndex={0}
            >
              <span>{item.icon}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function getLocalDateTimeString(dateString: string) {
  const date = new Date(dateString);
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - tzOffset)
    .toISOString()
    .slice(0, 16);
  return localISOTime;
}

const EditVacancyModal: React.FC<EditVacancyModalProps> = ({
  open,
  onClose,
  onSubmit,
  vacancy,
}) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [stages, setStages] = useState<StageForm[]>([]);
  const [showRecruiter, setShowRecruiter] = useState(false);
  const [recruiter, setRecruiter] = useState<RecruiterForm>({
    recruiter_name: "",
    recruiter_contact: "",
  });
  const [error, setError] = useState("");
  const [initialData, setInitialData] = useState<any>(null);

  // Заполняем форму данными вакансии при открытии
  useEffect(() => {
    if (vacancy && open) {
      const initialStages = vacancy.stages.map((stage) => ({
        ...stage,
        date: getLocalDateTimeString(stage.date),
        icon: stage.icon || "Книжка",
      }));

      const initialRecruiter = {
        recruiter_name: vacancy.recruiter_name || "",
        recruiter_contact: vacancy.recruiter_contact || "",
      };

      setTitle(vacancy.title);
      setStatus(vacancy.status);
      setStages(initialStages);
      setShowRecruiter(!!(vacancy.recruiter_name || vacancy.recruiter_contact));
      setRecruiter(initialRecruiter);
      setError("");

      // Сохраняем начальные данные для сравнения
      setInitialData({
        title: vacancy.title,
        status: vacancy.status,
        stages: initialStages,
        recruiter: initialRecruiter,
        showRecruiter: !!(vacancy.recruiter_name || vacancy.recruiter_contact),
      });
    }
  }, [vacancy, open]);

  if (!open || !vacancy) return null;

  // Проверяем, изменились ли данные
  const hasChanges = () => {
    if (!initialData) return false;

    // Проверяем основные поля
    if (title !== initialData.title || status !== initialData.status) {
      return true;
    }

    // Проверяем рекрутера
    if (showRecruiter !== initialData.showRecruiter) {
      return true;
    }

    if (
      showRecruiter &&
      (recruiter.recruiter_name !== initialData.recruiter.recruiter_name ||
        recruiter.recruiter_contact !== initialData.recruiter.recruiter_contact)
    ) {
      return true;
    }

    // Проверяем стадии
    if (stages.length !== initialData.stages.length) {
      return true;
    }

    for (let i = 0; i < stages.length; i++) {
      const current = stages[i];
      const initial = initialData.stages[i];

      if (
        !initial ||
        current.stage_name !== initial.stage_name ||
        current.status !== initial.status ||
        current.date !== initial.date ||
        current.comment !== initial.comment ||
        current.icon !== initial.icon
      ) {
        return true;
      }
    }

    return false;
  };

  const handleStageChange = (
    idx: number,
    field: keyof StageForm,
    value: string
  ) => {
    setStages((stages) =>
      stages.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const handleAddStage = () => {
    setStages([
      ...stages,
      {
        stage_name: "",
        status: "",
        date: new Date().toISOString().slice(0, 16),
        comment: "",
        icon: "Книжка",
      },
    ]);
  };

  const handleRemoveStage = (idx: number) => {
    setStages((stages) => stages.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Укажите название вакансии");
      return;
    }
    if (!status) {
      setError("Выберите статус вакансии");
      return;
    }
    if (
      stages.length === 0 ||
      stages.some((s) => !s.stage_name || !s.status || !s.date)
    ) {
      setError("Заполните все поля стадий");
      return;
    }
    setError("");
    const preparedStages = stages.map((stage) => ({
      ...stage,
      date: new Date(stage.date).toISOString().replace(/\.\d{3}Z$/, "Z"),
    }));
    onSubmit({
      title: title.trim(),
      status,
      recruiter_name: showRecruiter ? recruiter.recruiter_name : undefined,
      recruiter_contact: showRecruiter
        ? recruiter.recruiter_contact
        : undefined,
      stages: preparedStages,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal__header">
          <h2>Редактировать отклик</h2>
          <button className="modal__close-x" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} id="edit-vacancy-form">
          <input
            type="text"
            placeholder="Название вакансии *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="vacancy-status-select"
          >
            <option value="">Статус вакансии *</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
          <div className="modal__stages">
            <div className="modal__stages-header">
              <span>Стадии</span>
              <button type="button" onClick={handleAddStage}>
                + Добавить стадию
              </button>
            </div>
            {stages.map((stage, idx) => (
              <div className="modal__stage-row" key={idx}>
                <div className="modal__stage-icon-select">
                  <IconPickerGrid
                    value={stage.icon || "Книжка"}
                    onChange={(v) => handleStageChange(idx, "icon", v)}
                  />
                </div>
                <div className="modal__stage-fields">
                  <div className="modal__stage-fields-row1">
                    <input
                      type="text"
                      placeholder="Название стадии *"
                      value={stage.stage_name}
                      onChange={(e) =>
                        handleStageChange(idx, "stage_name", e.target.value)
                      }
                      required
                    />
                    <select
                      value={stage.status}
                      onChange={(e) =>
                        handleStageChange(idx, "status", e.target.value)
                      }
                      required
                      className="stage-status-select"
                    >
                      <option value="">Статус *</option>
                      <option value="Отправлено">Отправлено</option>
                      <option value="Ожидание">Ожидание</option>
                      <option value="Одобрено">Одобрено</option>
                      <option value="Отклонено">Отклонено</option>
                      <option value="Игнор">Игнор</option>
                    </select>
                    <input
                      type="datetime-local"
                      value={stage.date}
                      onChange={(e) =>
                        handleStageChange(idx, "date", e.target.value)
                      }
                      required
                      className="stage-date-input"
                    />
                  </div>
                  <div className="modal__stage-fields-row2">
                    <input
                      type="text"
                      placeholder="Комментарий"
                      value={stage.comment || ""}
                      onChange={(e) =>
                        handleStageChange(idx, "comment", e.target.value)
                      }
                      className="stage-comment-input"
                    />
                    <button
                      type="button"
                      className="modal__remove-stage"
                      onClick={() => handleRemoveStage(idx)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {showRecruiter ? (
            <div className="modal__recruiter-container">
              <button
                type="button"
                className="modal__recruiter-hide-btn"
                onClick={() => setShowRecruiter(false)}
              >
                Скрыть рекрутера
              </button>
              <input
                type="text"
                placeholder="Имя рекрутера"
                value={recruiter.recruiter_name}
                onChange={(e) =>
                  setRecruiter({
                    ...recruiter,
                    recruiter_name: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Контакт рекрутера (email, telegram)"
                value={recruiter.recruiter_contact}
                onChange={(e) =>
                  setRecruiter({
                    ...recruiter,
                    recruiter_contact: e.target.value,
                  })
                }
              />
            </div>
          ) : (
            <button
              type="button"
              className="modal__recruiter-toggle"
              onClick={() => setShowRecruiter(true)}
            >
              Добавить рекрутера
            </button>
          )}
          {error && <div className="modal__error">{error}</div>}
        </form>
        <div className="modal__actions">
          <button
            type="button"
            disabled={!hasChanges()}
            onClick={() => {
              const form = document.getElementById(
                "edit-vacancy-form"
              ) as HTMLFormElement;
              if (form) {
                form.requestSubmit();
              }
            }}
          >
            Сохранить
          </button>
          <button type="button" onClick={onClose} className="modal__close-btn">
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVacancyModal;
