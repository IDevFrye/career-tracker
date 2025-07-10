import React from "react";
import { RoleStats } from "../store/statsSlice";
import "./RoleStatsChart.scss";
import { Doughnut } from "../utils/chartConfig";

interface RoleStatsChartProps {
  stats: RoleStats;
}

const RoleStatsChart: React.FC<RoleStatsChartProps> = ({ stats }) => {
  const statuses = [
    { key: "active", label: "Активные", color: "#5f99c2" },
    { key: "rejected", label: "Отклоненные", color: "#c25f64" },
    { key: "offer", label: "Офферы", color: "#6ac25f" },
    { key: "ignored", label: "Проигнорированные", color: "#975fc2" },
    { key: "abandoned", label: "Заброшенные", color: "#c9c9c9" },
  ];

  const nonZeroStatuses = statuses.filter(
    (status) => (stats[status.key as keyof RoleStats] as number) > 0
  );

  if (stats.total === 0) {
    return (
      <div className="role-stats-chart">
        <h3 className="role-stats-chart__title">{stats.role}</h3>
        <div className="role-stats-chart__empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>Нет данных для отображения</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: nonZeroStatuses.map((status) => status.label),
    datasets: [
      {
        data: nonZeroStatuses.map(
          (status) => stats[status.key as keyof RoleStats]
        ),
        backgroundColor: nonZeroStatuses.map((status) => status.color),
        borderColor: nonZeroStatuses.map((status) => status.color),
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
    onHover: (event: any, elements: any) => {
      const canvas = event.native.target;
      canvas.style.cursor = elements.length ? "pointer" : "default";
    },
  };

  return (
    <div className="role-stats-chart">
      <h3 className="role-stats-chart__title">{stats.role}</h3>
      <div className="role-stats-chart__content">
        <div className="role-stats-chart__chart">
          <Doughnut data={chartData} options={chartOptions} />
          <div className="role-stats-chart__center">
            <span className="role-stats-chart__total">{stats.total}</span>
            <span className="role-stats-chart__label">всего</span>
          </div>
        </div>
        <div className="role-stats-chart__legend">
          {nonZeroStatuses.map((status) => (
            <div key={status.key} className="role-stats-chart__legend-item">
              <div
                className="role-stats-chart__legend-color"
                style={{ backgroundColor: status.color }}
              />
              <span className="role-stats-chart__legend-label">
                {status.label}
              </span>
              <span className="role-stats-chart__legend-value">
                {stats[status.key as keyof RoleStats]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleStatsChart;
