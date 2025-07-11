import React from "react";
import ThemeToggle from "./ThemeToggle";
import { supabase } from "../supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.scss";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <h1>
            <span className="hh-link__logo"></span>
          </h1>
        </div>
        <nav className="header__nav">
          <button
            className={`header__nav-item ${
              currentPath === "/" ? "active" : ""
            }`}
            onClick={() => navigate("/")}
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
                d="M11 9h6m-6 3h6m-6 3h6M6.996 9h.01m-.01 3h.01m-.01 3h.01M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
              />
            </svg>
            Отклики
          </button>
          <button
            className={`header__nav-item ${
              currentPath === "/questions" ? "active" : ""
            }`}
            onClick={() => navigate("/questions")}
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
                d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Вопросы
          </button>
          <button
            className={`header__nav-item ${
              currentPath === "/stats" ? "active" : ""
            }`}
            onClick={() => navigate("/stats")}
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
                d="M4 4v15a1 1 0 0 0 1 1h15M8 16l2.5-5.5 3 3L17.273 7 20 9.667"
              />
            </svg>
            Аналитика
          </button>
        </nav>
        <div className="header__actions">
          <ThemeToggle />
          <button
            className="header__logout-btn"
            onClick={() => supabase.auth.signOut()}
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
