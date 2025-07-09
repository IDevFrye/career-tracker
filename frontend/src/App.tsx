import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import TrackerPage from "./pages/TrackerPage";
import Header from "./components/Header";
import "./App.scss";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("tracker");

  const renderPage = () => {
    switch (currentPage) {
      case "tracker":
        return <TrackerPage />;
      case "questions":
        return (
          <div className="page-placeholder">Страница вопросов в разработке</div>
        );
      case "analytics":
        return (
          <div className="page-placeholder">
            Страница аналитики в разработке
          </div>
        );
      default:
        return <TrackerPage />;
    }
  };

  return (
    <Provider store={store}>
      <div className="app">
        <Header currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="app__main">{renderPage()}</main>
      </div>
    </Provider>
  );
};

export default App;
