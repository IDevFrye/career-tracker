import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "./contexts/ThemeContext";
import TrackerPage from "./pages/TrackerPage";
import QuestionsPage from "./pages/QuestionsPage";
import StatsPage from "./pages/StatsPage";
import Header from "./components/Header";
import "./App.scss";
import "./styles/dark-theme.scss";
import "./utils/chartConfig";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("tracker");

  const renderPage = () => {
    switch (currentPage) {
      case "tracker":
        return <TrackerPage />;
      case "questions":
        return <QuestionsPage />;
      case "analytics":
        return <StatsPage />;
      default:
        return <TrackerPage />;
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="app">
          <Header currentPage={currentPage} onPageChange={setCurrentPage} />
          <main className="app__main">{renderPage()}</main>
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
