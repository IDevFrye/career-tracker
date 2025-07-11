import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVacancies,
  addVacancy,
  deleteVacancy,
} from "../store/vacanciesSlice";
import { RootState, AppDispatch } from "../store";
import VacancyCard from "../components/VacancyCard";
import AddVacancyModal from "../components/AddVacancyModal";
import TableView from "../components/TableView";
import VacancyModal from "../components/VacancyModal";
import ConfirmModal from "../components/ConfirmModal";
import "./TrackerPage.scss";

const TrackerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.vacancies
  );
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedVacancyId, setSelectedVacancyId] = React.useState<
    number | null
  >(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [vacancyToDelete, setVacancyToDelete] = React.useState<number | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchVacancies());

    const interval = setInterval(() => {
      dispatch(fetchVacancies());
      localStorage.removeItem("vacancyDetailsCache");
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleAddVacancy = async (data: any) => {
    await dispatch(addVacancy(data));
    dispatch(fetchVacancies());
    localStorage.removeItem("vacancyDetailsCache");
    setIsModalOpen(false);
  };

  const handleDeleteVacancy = (id: number) => {
    setVacancyToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (vacancyToDelete) {
      try {
        await dispatch(deleteVacancy(vacancyToDelete));
        localStorage.removeItem("vacancyDetailsCache");
      } catch (error) {
        console.error("Ошибка при удалении вакансии:", error);
      }
    }
    setDeleteConfirmOpen(false);
    setVacancyToDelete(null);
  };

  return (
    <div className="tracker-page">
      <div className="tracker-page__header">
        <h1>Трекер откликов</h1>
        <div className="tracker-page__view-toggle">
          <button
            className={viewMode === "cards" ? "active" : ""}
            onClick={() => setViewMode("cards")}
            title="Карточки"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            className={viewMode === "table" ? "active" : ""}
            onClick={() => setViewMode("table")}
            title="Таблица"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V3" />
            </svg>
          </button>
        </div>
        <button
          className="add-vacancy-btn"
          onClick={() => setIsModalOpen(true)}
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
          Добавить отклик
        </button>
      </div>
      {loading ? (
        <div className="tracker-page__loading">Загрузка...</div>
      ) : viewMode === "cards" ? (
        <>
          {items.length === 0 ? (
            <div className="tracker-page__empty">
              <div className="tracker-page__empty-icon">
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
              <h3 className="tracker-page__empty-title">Нет откликов</h3>
              <p className="tracker-page__empty-description">
                Начните отслеживать свои отклики на вакансии. Добавьте первый
                отклик, чтобы видеть прогресс поиска работы.
              </p>
              <button
                className="tracker-page__empty-btn"
                onClick={() => setIsModalOpen(true)}
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
                Добавить первый отклик
              </button>
            </div>
          ) : (
            <div className="tracker-page__list">
              {items.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  onClick={() => setSelectedVacancyId(vacancy.id)}
                  onDelete={() => handleDeleteVacancy(vacancy.id)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {error && <div className="error">{error}</div>}
          {items.length === 0 ? (
            <div className="tracker-page__empty">
              <div className="tracker-page__empty-icon">
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
              <h3 className="tracker-page__empty-title">Нет откликов</h3>
              <p className="tracker-page__empty-description">
                Начните отслеживать свои отклики на вакансии. Добавьте первый
                отклик, чтобы видеть прогресс поиска работы.
              </p>
              <button
                className="tracker-page__empty-btn"
                onClick={() => setIsModalOpen(true)}
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
                Добавить первый отклик
              </button>
            </div>
          ) : (
            <TableView vacancies={items} />
          )}
        </>
      )}
      <AddVacancyModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddVacancy}
      />
      <VacancyModal
        id={selectedVacancyId ?? 0}
        open={selectedVacancyId !== null}
        onClose={() => setSelectedVacancyId(null)}
        onEdit={() => {}}
      />
      <ConfirmModal
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setVacancyToDelete(null);
        }}
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

export default TrackerPage;
