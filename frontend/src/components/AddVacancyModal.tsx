import React, { useState } from "react";
import "./AddVacancyModal.scss";
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

interface AddVacancyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    url: string;
    recruiter_name?: string;
    recruiter_contact?: string;
    stages: StageForm[];
  }) => void;
}

const defaultStage = (): StageForm => ({
  stage_name: "Отклик",
  status: "sent",
  date: new Date().toISOString(),
  comment: "",
  icon: "Компьютер",
});

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

function getLocalDateTimeString() {
  const now = new Date();
  now.setSeconds(0, 0);
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localISOTime = new Date(now.getTime() - tzOffset)
    .toISOString()
    .slice(0, 16);
  return localISOTime;
}

const AddVacancyModal: React.FC<AddVacancyModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [url, setUrl] = useState("");
  const [stages, setStages] = useState<StageForm[]>([
    {
      stage_name: "",
      status: "",
      date: getLocalDateTimeString(),
      comment: "",
      icon: "Компьютер",
    },
  ]);
  const [showRecruiter, setShowRecruiter] = useState(false);
  const [recruiter, setRecruiter] = useState<RecruiterForm>({
    recruiter_name: "",
    recruiter_contact: "",
  });
  const [error, setError] = useState("");

  if (!open) return null;

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
        date: getLocalDateTimeString(),
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
    if (!url) {
      setError("Укажите ссылку на вакансию");
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
      url,
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
          <h2>Добавить отклик</h2>
          <button className="modal__close-x" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="Ссылка на вакансию (hh.ru) *"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
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
          <div className="modal__actions">
            <button type="submit">Добавить</button>
            <button
              type="button"
              onClick={onClose}
              className="modal__close-btn"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVacancyModal;
