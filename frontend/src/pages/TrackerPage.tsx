import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVacancies, addVacancy } from "../store/vacanciesSlice";
import { RootState, AppDispatch } from "../store";
import VacancyCard from "../components/VacancyCard";
import AddVacancyModal from "../components/AddVacancyModal";
import "./TrackerPage.scss";

const TrackerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.vacancies
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchVacancies());
  }, [dispatch]);

  const handleAddVacancy = async (data: any) => {
    await dispatch(addVacancy(data));
    dispatch(fetchVacancies());
    setIsModalOpen(false);
  };

  return (
    <div className="tracker-page">
      <div className="tracker-page__header">
        <h1>Трекер откликов</h1>
        <button
          className="add-vacancy-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          Добавить отклик
        </button>
      </div>
      {loading ? (
        <div className="tracker-page__loading">Загрузка...</div>
      ) : (
        <>
          {error && <div className="error">{error}</div>}
          <div className="tracker-page__list">
            {items.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                onClick={() => {}}
              />
            ))}
          </div>
        </>
      )}
      <AddVacancyModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddVacancy}
      />
    </div>
  );
};

export default TrackerPage;
