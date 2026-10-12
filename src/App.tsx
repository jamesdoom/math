import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import { ProgressProvider, useProgress } from "./context/ProgressContext";
import { Dashboard } from "./pages/Dashboard";
import { ChapterPage } from "./pages/ChapterPage";
import { LessonPage } from "./pages/LessonPage";
import { PracticePage } from "./pages/PracticePage";
function Shell() {
  const { progress, storageError } = useProgress();
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
          <NavLink to="/chapter/3">Chapter 3</NavLink>
          <NavLink to="/practice">Practice</NavLink>
        </nav>
        <span className="xp">✧ {progress.xp} XP</span>
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
          <Route path="/chapter/3" element={<ChapterPage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/practice" element={<PracticePage />} />
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
        <span>Algebra Lab · Chapter 3</span>
        <span>Understand the why. Build the confidence.</span>
        <span>Saved on this browser</span>
      </footer>
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <Shell />
      </ProgressProvider>
    </BrowserRouter>
  );
}
