import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoleStats } from "../store/statsSlice";
import { RootState, AppDispatch } from "../store";
import RoleStatsChart from "../components/RoleStatsChart";
import OverallStatsChart from "../components/OverallStatsChart";
import "./StatsPage.scss";

const StatsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { roles, loading, error } = useSelector(
    (state: RootState) => state.stats
  );

  const safeRoles = roles || [];

  useEffect(() => {
    dispatch(fetchRoleStats());
  }, [dispatch]);

  const totalApplications = safeRoles.reduce(
    (sum, role) => sum + role.total,
    0
  );
  const totalOffers = safeRoles.reduce((sum, role) => sum + role.offer, 0);
  const totalRejected = safeRoles.reduce((sum, role) => sum + role.rejected, 0);
  const totalActive = safeRoles.reduce((sum, role) => sum + role.active, 0);
  const totalIgnored = safeRoles.reduce((sum, role) => sum + role.ignored, 0);
  const totalAbandoned = safeRoles.reduce(
    (sum, role) => sum + role.abandoned,
    0
  );

  const offerRate =
    totalApplications > 0
      ? ((totalOffers / totalApplications) * 100).toFixed(1)
      : "0";
  const rejectionRate =
    totalApplications > 0
      ? ((totalRejected / totalApplications) * 100).toFixed(1)
      : "0";

  if (loading) {
    return (
      <div className="stats-page">
        <div className="stats-page__loading">
          <div className="stats-page__loading-spinner"></div>
          <p>Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-page">
        <div className="stats-page__error">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3>Ошибка загрузки</h3>
          <p>{error}</p>
          <button
            onClick={() => dispatch(fetchRoleStats())}
            className="stats-page__retry-btn"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="stats-page__header">
        <h1>Общая статистика</h1>
      </div>

      {totalApplications === 0 ? (
        <div className="stats-page__empty">
          <div className="stats-page__empty-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="stats-page__empty-title">Нет данных для статистики</h3>
          <p className="stats-page__empty-description">
            Добавьте отклики на вакансии, чтобы увидеть подробную статистику по
            должностям и общие метрики.
          </p>
          <button
            className="stats-page__empty-btn"
            onClick={() => (window.location.href = "/")}
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
            Добавить отклик
          </button>
        </div>
      ) : (
        <>
          <div className="stats-page__overview">
            <div className="stats-page__overview-chart">
              <OverallStatsChart roles={safeRoles} />
            </div>

            <div className="stats-page__overview-cards">
              <div className="stats-page__overview-row stats-page__overview-row--main">
                <div className="stats-page__overview-card stats-page__overview-card--main">
                  <div className="stats-page__overview-icon stats-page__overview-icon--main">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="stats-page__overview-content">
                    <span className="stats-page__overview-value stats-page__overview-value--main">
                      {totalApplications}
                    </span>
                    <span className="stats-page__overview-label">
                      Всего откликов
                    </span>
                  </div>
                </div>
              </div>

              <div className="stats-page__overview-row">
                <div className="stats-page__overview-card stats-page__overview-card--success">
                  <div className="stats-page__overview-icon stats-page__overview-icon--success">
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
                        d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <div className="stats-page__overview-content">
                    <span className="stats-page__overview-value">
                      {totalOffers}
                    </span>
                    <span className="stats-page__overview-label">Офферов</span>
                  </div>
                </div>

                <div className="stats-page__overview-card stats-page__overview-card--warning">
                  <div className="stats-page__overview-icon stats-page__overview-icon--warning">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="stats-page__overview-content">
                    <span className="stats-page__overview-value">
                      {totalActive}
                    </span>
                    <span className="stats-page__overview-label">Активных</span>
                  </div>
                </div>

                <div className="stats-page__overview-card stats-page__overview-card--danger">
                  <div className="stats-page__overview-icon stats-page__overview-icon--danger">
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
                        stroke-width="2"
                        d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <div className="stats-page__overview-content">
                    <span className="stats-page__overview-value">
                      {totalRejected}
                    </span>
                    <span className="stats-page__overview-label">
                      Отклонено
                    </span>
                  </div>
                </div>
              </div>

              <div className="stats-page__overview-row">
                <div className="stats-page__overview-card stats-page__overview-card--info">
                  <div className="stats-page__overview-icon stats-page__overview-icon--info">
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
                        d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <div className="stats-page__overview-content">
                    <span className="stats-page__overview-value">
                      {totalIgnored}
                    </span>
                    <span className="stats-page__overview-label">
                      Проигнорировано
                    </span>
                  </div>
                </div>

                <div className="stats-page__overview-card stats-page__overview-card--neutral">
                  <div className="stats-page__overview-icon stats-page__overview-icon--neutral">
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
                        d="M10 9v6m4-6v6m7-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <div className="stats-page__overview-content">
                    <span className="stats-page__overview-value">
                      {totalAbandoned}
                    </span>
                    <span className="stats-page__overview-label">
                      Заброшено
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-page__metrics">
            <div className="stats-page__metric">
              <span className="stats-page__metric-label">Процент офферов</span>
              <span className="stats-page__metric-value stats-page__metric-value--success">
                {offerRate}%
              </span>
            </div>
            <div className="stats-page__metric">
              <span className="stats-page__metric-label">Процент отказов</span>
              <span className="stats-page__metric-value stats-page__metric-value--danger">
                {rejectionRate}%
              </span>
            </div>
          </div>

          <div className="stats-page__charts">
            <h2 className="stats-page__charts-title">
              Статистика по должностям
            </h2>

            {safeRoles.length === 0 ? (
              <div className="stats-page__empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h3>Нет данных для отображения</h3>
                <p>Добавьте отклики на вакансии, чтобы увидеть статистику</p>
              </div>
            ) : (
              <div className="stats-page__charts-grid">
                {safeRoles.map((roleStats) => (
                  <RoleStatsChart key={roleStats.role} stats={roleStats} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StatsPage;
