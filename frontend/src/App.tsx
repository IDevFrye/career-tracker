import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "./contexts/ThemeContext";
import TrackerPage from "./pages/TrackerPage";
import QuestionsPage from "./pages/QuestionsPage";
import StatsPage from "./pages/StatsPage";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import { supabase } from "./supabaseClient";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.scss";
import "./styles/dark-theme.scss";
import "./utils/chartConfig";

const AppRoutes: React.FC<{ session: any }> = ({ session }) => {
  const location = useLocation();
  const isRecovery =
    location.pathname === "/auth" &&
    (location.search.includes("type=recovery") ||
      location.search.includes("access_token"));
  if (!session && location.pathname !== "/auth") {
    return <Navigate to="/auth" replace />;
  }
  if (session && location.pathname === "/auth" && !isRecovery) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      {session && <Header />}
      <main className="app__main">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<TrackerPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route
            path="*"
            element={<Navigate to={session ? "/" : "/auth"} replace />}
          />
        </Routes>
      </main>
    </>
  );
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes session={session} />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
