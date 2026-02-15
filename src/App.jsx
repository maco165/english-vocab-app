import { useState, useEffect, useRef } from "react";
import Quiz from "./components/Quiz";
import Review from "./components/Review";
import Stats from "./components/Stats";
import WordList from "./components/WordList";
import GrammarList from "./components/GrammarList";
import "./App.css";

const pages = [
  { key: "quiz", label: "クイズ" },
  { key: "review", label: "復習" },
  { key: "words", label: "単語一覧" },
  { key: "grammar", label: "文法" },
  { key: "stats", label: "統計" },
];

export default function App() {
  const [page, setPage] = useState("quiz");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleNav = (key) => {
    setPage(key);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const currentLabel = pages.find((p) => p.key === page)?.label;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">英単語道場</h1>

        {/* Desktop nav */}
        <nav className="app-nav desktop-nav">
          {pages.map((p) => (
            <button
              key={p.key}
              className={`nav-btn ${p.key === "review" ? "review" : ""} ${page === p.key ? "active" : ""}`}
              onClick={() => handleNav(p.key)}
            >
              {p.label}
            </button>
          ))}
        </nav>

        {/* Mobile nav */}
        <div className="mobile-nav" ref={menuRef}>
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
          >
            <span className={`hamburger-icon ${menuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span className="hamburger-label">{currentLabel}</span>
          </button>
          {menuOpen && (
            <div className="dropdown-menu">
              {pages.map((p) => (
                <button
                  key={p.key}
                  className={`dropdown-item ${page === p.key ? "active" : ""}`}
                  onClick={() => handleNav(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {page === "quiz" && <Quiz key={page} />}
        {page === "review" && <Review key={Date.now()} />}
        {page === "words" && <WordList />}
        {page === "grammar" && <GrammarList />}
        {page === "stats" && <Stats />}
      </main>
    </div>
  );
}
