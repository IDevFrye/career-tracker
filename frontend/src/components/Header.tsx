import React from "react";
import "./Header.scss";

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <h1>Career Tracker</h1>
        </div>
        <nav className="header__nav">
          <button
            className={`header__nav-item ${
              currentPage === "tracker" ? "active" : ""
            }`}
            onClick={() => onPageChange("tracker")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            Отклики
          </button>
          <button
            className={`header__nav-item ${
              currentPage === "questions" ? "active" : ""
            }`}
            onClick={() => onPageChange("questions")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
            </svg>
            Вопросы
          </button>
          <button
            className={`header__nav-item ${
              currentPage === "analytics" ? "active" : ""
            }`}
            onClick={() => onPageChange("analytics")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21M16,8H18V15H16V8M12,10H14V15H12V10M8,5H10V15H8V5M4,5H6V15H4V5Z" />
            </svg>
            Аналитика
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
