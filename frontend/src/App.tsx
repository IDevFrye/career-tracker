import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Главная страница трекера</div>} />
        <Route
          path="/questions"
          element={<div>Страница вопросов и заметок</div>}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
