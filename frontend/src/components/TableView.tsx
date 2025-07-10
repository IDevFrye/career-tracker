import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchVacancyDetails } from "../store/vacanciesSlice";
import { StageIcons } from "./VacancyCard";
import "./TableView.scss";

const columns = [
  { key: "id", label: "№", minWidth: 20 },
  { key: "title", label: "Вакансия", minWidth: 220 },
  { key: "company", label: "Компания", minWidth: 80 },
  { key: "salary", label: "Зарплата", minWidth: 75 },
  { key: "work_schedule", label: "График", minWidth: 80 },
  { key: "experience", label: "Опыт", minWidth: 80 },
  { key: "employment_type", label: "Тип занятости", minWidth: 80 },
  { key: "roles", label: "Роли", minWidth: 120 },
  { key: "stages", label: "Стадии", minWidth: 120 },
];

const getStatusColor = (status: string) => {
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
      return "#bdbdbd";
  }
};

const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    style={{ verticalAlign: "middle" }}
  >
    <path
      d="M1.667 10S4.167 4.167 10 4.167 18.333 10 18.333 10 15.833 15.833 10 15.833 1.667 10 1.667 10Z"
      stroke="#888"
      strokeWidth="1.5"
    />
    <circle cx="10" cy="10" r="3.333" stroke="#888" strokeWidth="1.5" />
  </svg>
);

interface TableViewProps {
  vacancies: any[];
}

interface VacancyDetails {
  [id: number]: any;
}

const VACANCY_CACHE_KEY = "vacancyDetailsCache";

const sortDirections = {
  asc: "asc",
  desc: "desc",
};

const SortArrow = ({ dir }: { dir: "asc" | "desc" }) => (
  <span
    style={{
      marginLeft: 4,
      fontSize: 13,
      color: "#1976d2",
      userSelect: "none",
    }}
  >
    {dir === "asc" ? "▲" : "▼"}
  </span>
);

// Разрешённые для сортировки индексы
const sortableCols = [0, 1, 2, 8]; // id, title, company, stages
// Индексы фильтруемых колонок
const filterableCols = [4, 5, 6, 7]; // work_schedule, experience, employment_type, roles

const PAGE_SIZE = 10;

const TableView: React.FC<TableViewProps> = ({ vacancies }) => {
  const [details, setDetails] = useState<VacancyDetails>({});
  const [isCacheLoaded, setIsCacheLoaded] = useState(false);
  const [colWidths, setColWidths] = useState<number[]>(
    columns.map((c) => c.minWidth)
  );
  const [showCols, setShowCols] = useState<boolean[]>(columns.map(() => true));
  const [showColMenu, setShowColMenu] = useState(false);
  const [sortCol, setSortCol] = useState<number>(0); // индекс столбца
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<{ [colIdx: number]: string }>({});
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const resizingCol = useRef<number | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Сброс страницы при смене фильтров
  React.useEffect(() => {
    setPage(1);
  }, [filters]);

  // Загружаем кэш из localStorage при монтировании
  useEffect(() => {
    const cacheStr = localStorage.getItem(VACANCY_CACHE_KEY);
    if (cacheStr) {
      try {
        const cache = JSON.parse(cacheStr);
        setDetails(cache);
      } catch {}
    }
    setIsCacheLoaded(true);
  }, []);

  // Сохраняем кэш при изменении details
  useEffect(() => {
    if (isCacheLoaded) {
      localStorage.setItem(VACANCY_CACHE_KEY, JSON.stringify(details));
    }
  }, [details, isCacheLoaded]);

  // Запросы к API только после загрузки кэша
  useEffect(() => {
    if (!isCacheLoaded) return;
    vacancies.forEach((v) => {
      if (!details[v.id]) {
        dispatch<any>(fetchVacancyDetails(v.id)).then((action: any) => {
          if (action.payload && action.payload.details) {
            setDetails((prev) => ({ ...prev, [v.id]: action.payload.details }));
          }
        });
      }
    });
    // eslint-disable-next-line
  }, [vacancies, isCacheLoaded]);

  // Собираем уникальные значения для фильтров
  const uniqueValues: { [colIdx: number]: string[] } = {};
  vacancies.forEach((v) => {
    const d = details[v.id];
    if (d) {
      if (!uniqueValues[4]) uniqueValues[4] = [];
      if (!uniqueValues[5]) uniqueValues[5] = [];
      if (!uniqueValues[6]) uniqueValues[6] = [];
      if (!uniqueValues[7]) uniqueValues[7] = [];
      // work_schedule
      if (d.work_schedule && !uniqueValues[4].includes(d.work_schedule))
        uniqueValues[4].push(d.work_schedule);
      // experience
      if (d.experience && !uniqueValues[5].includes(d.experience))
        uniqueValues[5].push(d.experience);
      // employment_type
      if (d.employment_type && !uniqueValues[6].includes(d.employment_type))
        uniqueValues[6].push(d.employment_type);
      // roles
      if (Array.isArray(d.roles)) {
        d.roles.forEach((role: string) => {
          if (role && !uniqueValues[7].includes(role))
            uniqueValues[7].push(role);
        });
      }
    }
  });
  // Сортируем значения для удобства
  Object.values(uniqueValues).forEach((arr) => arr.sort());

  // Фильтрация данных
  const filteredVacancies = [...vacancies].filter((v) => {
    const d = details[v.id];
    // work_schedule
    if (filters[4] && (!d || d.work_schedule !== filters[4])) return false;
    // experience
    if (filters[5] && (!d || d.experience !== filters[5])) return false;
    // employment_type
    if (filters[6] && (!d || d.employment_type !== filters[6])) return false;
    // roles (хотя бы одна совпадает)
    if (
      filters[7] &&
      (!d || !Array.isArray(d.roles) || !d.roles.includes(filters[7]))
    )
      return false;
    return true;
  });

  // Drag-to-resize logic
  const onMouseDown = (idx: number, e: React.MouseEvent) => {
    resizingCol.current = idx;
    startX.current = e.clientX;
    startWidth.current = colWidths[idx];
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  const onMouseMove = (e: MouseEvent) => {
    if (resizingCol.current !== null) {
      const delta = e.clientX - startX.current;
      setColWidths((widths) => {
        const newWidths = [...widths];
        newWidths[resizingCol.current!] = Math.max(
          columns[resizingCol.current!].minWidth,
          startWidth.current + delta
        );
        return newWidths;
      });
    }
  };
  const onMouseUp = () => {
    resizingCol.current = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  // Click outside menu to close
  useEffect(() => {
    if (!showColMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowColMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showColMenu]);

  // Сортировка данных
  const getCellValue = (v: any, d: any, colIdx: number) => {
    switch (columns[colIdx].key) {
      case "id":
        // Для сортировки используем реальный ID, но для отображения будем показывать порядковый номер
        return v.id;
      case "title":
        return v.title || "";
      case "company":
        return v.company || "";
      case "salary":
        return d ? d.salary_from || 0 : 0;
      case "work_schedule":
        return d ? d.work_schedule || "" : "";
      case "experience":
        return d ? d.experience || "" : "";
      case "employment_type":
        return d ? d.employment_type || "" : "";
      case "roles":
        return d && Array.isArray(d.roles) ? d.roles.join(", ") : "";
      case "stages":
        return d && Array.isArray(d.stages) ? d.stages.length : 0;
      default:
        return "";
    }
  };

  const sortedVacancies = [...filteredVacancies].sort((a, b) => {
    const dA = details[a.id];
    const dB = details[b.id];
    const idx = sortCol;
    if (!sortableCols.includes(idx)) return 0;
    const valA = getCellValue(a, dA, idx);
    const valB = getCellValue(b, dB, idx);
    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;
    if (typeof valA === "number" && typeof valB === "number") {
      return sortDir === "asc" ? valA - valB : valB - valA;
    }
    return sortDir === "asc"
      ? String(valA).localeCompare(String(valB), "ru")
      : String(valB).localeCompare(String(valA), "ru");
  });

  // Пагинация
  const totalPages = Math.ceil(sortedVacancies.length / PAGE_SIZE) || 1;
  const pagedVacancies = sortedVacancies.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="table-view-wrapper">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 8,
          position: "relative",
        }}
      >
        <div
          className="table-cols-menu-container"
          style={{ position: "relative", display: "inline-block" }}
        >
          <button
            className="table-cols-toggle-btn"
            onClick={() => setShowColMenu((v) => !v)}
            title="Показать/скрыть столбцы"
          >
            <EyeIcon />
          </button>
          {showColMenu && (
            <div className="table-cols-menu" ref={menuRef}>
              {columns.map((col, idx) => (
                <label key={col.key}>
                  <input
                    type="checkbox"
                    checked={showCols[idx]}
                    onChange={() => {
                      const arr = [...showCols];
                      arr[idx] = !arr[idx];
                      setShowCols(arr);
                    }}
                  />
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>
        <span style={{ color: "#888", fontSize: 14, marginLeft: 8 }}>
          Показать/скрыть столбцы
        </span>
      </div>
      <div className="table-view-scroll">
        <table className="table-view">
          <thead>
            <tr>
              {columns.map(
                (col, idx) =>
                  showCols[idx] && (
                    <th
                      key={col.key}
                      style={{
                        minWidth: colWidths[idx],
                        width: colWidths[idx],
                        cursor: sortableCols.includes(idx)
                          ? "pointer"
                          : "default",
                        userSelect: "none",
                      }}
                      onClick={() => {
                        if (!sortableCols.includes(idx)) return;
                        if (sortCol === idx) {
                          setSortDir(sortDir === "asc" ? "desc" : "asc");
                        } else {
                          setSortCol(idx);
                          setSortDir("asc");
                        }
                      }}
                    >
                      {col.label}
                      {sortCol === idx && sortableCols.includes(idx) && (
                        <SortArrow dir={sortDir} />
                      )}
                      <span
                        className="col-resize-handle"
                        onMouseDown={(e) => onMouseDown(idx, e)}
                      />
                    </th>
                  )
              )}
            </tr>
            {/* Фильтры */}
            <tr>
              {columns.map(
                (col, idx) =>
                  showCols[idx] && (
                    <th
                      key={col.key + "-filter"}
                      style={{
                        background: "#f7f7f7",
                        padding: 4,
                        minWidth: colWidths[idx],
                        width: colWidths[idx],
                      }}
                    >
                      {filterableCols.includes(idx) &&
                      uniqueValues[idx] &&
                      uniqueValues[idx].length > 0 ? (
                        <select
                          value={filters[idx] || ""}
                          onChange={(e) =>
                            setFilters((f) => ({ ...f, [idx]: e.target.value }))
                          }
                          style={{
                            width: "100%",
                            padding: "2px 6px",
                            borderRadius: 6,
                            border: "1px solid #e0e7ef",
                            background: "#fff",
                            fontSize: 14,
                          }}
                        >
                          <option value="">Все</option>
                          {uniqueValues[idx].map((val) => (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {pagedVacancies.map((v, index) => {
              const d = details[v.id];
              return (
                <tr key={v.id}>
                  {showCols[0] && <td>{(page - 1) * PAGE_SIZE + index + 1}</td>}
                  {showCols[1] && (
                    <td>
                      <a
                        href={v.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {v.title}
                      </a>
                    </td>
                  )}
                  {showCols[2] && <td>{v.company}</td>}
                  {showCols[3] && (
                    <td>
                      {d
                        ? d.salary_from && d.salary_to
                          ? `${d.salary_from} – ${d.salary_to} ${
                              d.salary_currency === "RUR"
                                ? "руб."
                                : d.salary_currency || ""
                            }`
                          : "—"
                        : "—"}
                    </td>
                  )}
                  {showCols[4] && <td>{d ? d.work_schedule : "—"}</td>}
                  {showCols[5] && <td>{d ? d.experience : "—"}</td>}
                  {showCols[6] && <td>{d ? d.employment_type : "—"}</td>}
                  {showCols[7] && (
                    <td>
                      {d && Array.isArray(d.roles) ? d.roles.join(", ") : "—"}
                    </td>
                  )}
                  {showCols[8] && (
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        {d && Array.isArray(d.stages) && d.stages.length > 0
                          ? d.stages.map((stage: any, idx: number) => (
                              <span
                                key={idx}
                                title={stage.stage_name}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  color: getStatusColor(stage.status),
                                }}
                              >
                                {StageIcons[
                                  stage.icon as keyof typeof StageIcons
                                ] || StageIcons["Книжка"]}
                              </span>
                            ))
                          : "—"}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Пагинация */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            margin: "18px 0 8px 0",
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #e0e7ef",
              background: page === 1 ? "#f5f7fa" : "#fff",
              color: "#1976d2",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            ←
          </button>
          <span style={{ fontSize: 15, color: "#222" }}>
            Страница {page} из {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #e0e7ef",
              background: page === totalPages ? "#f5f7fa" : "#fff",
              color: "#1976d2",
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableView;
