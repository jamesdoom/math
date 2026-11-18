import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import { ProgressProvider, useProgress } from "./context/ProgressContext";
import { Dashboard } from "./pages/Dashboard";
import { ChapterPage } from "./pages/ChapterPage";
import { LessonPage } from "./pages/LessonPage";
import { PracticePage } from "./pages/PracticePage";
import { SessionPage } from "./pages/SessionPage";
import { PreferencesProvider } from "./context/PreferencesContext";
import { PreferencesPage } from "./pages/PreferencesPage";
function Shell() {
  const { storageError } = useProgress();
  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand-mark">ƒ</span>Algebra
          <span className="brand-light">Lab</span>
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>
            My learning
          </NavLink>
          <NavLink to="/chapter/5">Chapter 5</NavLink>
          <NavLink to="/practice">Practice</NavLink>
          <NavLink to="/preferences">Settings</NavLink>
        </nav>
      </header>
      <main>
        {storageError && (
          <p role="alert" className="callout">
            Your browser could not save progress. You can keep learning, but
            progress may be lost on refresh.
          </p>
        )}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chapter/5" element={<ChapterPage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/session" element={<SessionPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route
            path="*"
            element={
              <>
                <h1>Let’s get back to learning.</h1>
                <Link to="/">Go to dashboard</Link>
              </>
            }
          />
        </Routes>
      </main>
      <footer>
        <span>Algebra Lab · Chapter 5</span>
        <span>Understand the why. Build the confidence.</span>
        <span>Saved on this browser</span>
      </footer>
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <PreferencesProvider>
        <ProgressProvider>
          <Shell />
        </ProgressProvider>
      </PreferencesProvider>
    </BrowserRouter>
  );
}
