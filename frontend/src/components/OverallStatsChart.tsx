import React from "react";
import { RoleStats } from "../store/statsSlice";
import "./OverallStatsChart.scss";
import { Doughnut } from "../utils/chartConfig";

interface OverallStatsChartProps {
  roles: RoleStats[];
}

const OverallStatsChart: React.FC<OverallStatsChartProps> = ({ roles }) => {
  const statuses = [
    { key: "active", label: "Активные", color: "#5f99c2" },
    { key: "rejected", label: "Отклоненные", color: "#c25f64" },
    { key: "offer", label: "Офферы", color: "#6ac25f" },
    { key: "ignored", label: "Проигнорированные", color: "#975fc2" },
    { key: "abandoned", label: "Заброшенные", color: "#c9c9c9" },
  ];

  const totalStats = {
    total: roles.reduce((sum, role) => sum + role.total, 0),
    active: roles.reduce((sum, role) => sum + role.active, 0),
    rejected: roles.reduce((sum, role) => sum + role.rejected, 0),
    offer: roles.reduce((sum, role) => sum + role.offer, 0),
    ignored: roles.reduce((sum, role) => sum + role.ignored, 0),
    abandoned: roles.reduce((sum, role) => sum + role.abandoned, 0),
  };

  const nonZeroStatuses = statuses.filter(
    (status) =>
      (totalStats[status.key as keyof typeof totalStats] as number) > 0
  );

  if (totalStats.total === 0) {
    return (
      <div className="overall-stats-chart">
        <h3 className="overall-stats-chart__title">Общая статистика</h3>
        <div className="overall-stats-chart__empty">
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
          (status) => totalStats[status.key as keyof typeof totalStats]
        ),
        backgroundColor: nonZeroStatuses.map((status) => status.color),
        borderColor: nonZeroStatuses.map((status) => status.color),
        borderWidth: 3,
        hoverBorderWidth: 4,
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
    cutout: "50%",
    animation: {
      duration: 1000,
      easing: "easeInOutQuart" as const,
    },
    onHover: (event: any, elements: any) => {
      const canvas = event.native.target;
      canvas.style.cursor = elements.length ? "pointer" : "default";
    },
  };

  return (
    <div className="overall-stats-chart">
      <div className="overall-stats-chart__content">
        <div className="overall-stats-chart__chart">
          <div className="overall-stats-chart__chart-container">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <div className="overall-stats-chart__center">
            <span className="overall-stats-chart__total">
              {totalStats.total}
            </span>
            <span className="overall-stats-chart__label">всего</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallStatsChart;
