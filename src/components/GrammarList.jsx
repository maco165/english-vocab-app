import { useState } from "react";
import grammar from "../data/grammar";
import "./GrammarList.css";

const categories = [...new Set(grammar.map((g) => g.category))];

export default function GrammarList() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState(null);

  const filtered = grammar.filter((g) => {
    const matchCategory =
      activeCategory === "all" || g.category === activeCategory;
    const matchSearch =
      search === "" ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.explanation.includes(search) ||
      g.category.includes(search);
    return matchCategory && matchSearch;
  });

  return (
    <div className="grammar">
      <div className="grammar-header">
        <h2>文法一覧</h2>
        <span className="grammar-count">{filtered.length} / {grammar.length} 項目</span>
      </div>

      <input
        className="grammar-search"
        type="text"
        placeholder="文法を検索..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grammar-categories">
        <button
          className={`category-btn ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          すべて
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grammar-items">
        {filtered.map((g) => {
          const isOpen = openId === g.id;
          return (
            <div key={g.id} className={`grammar-item ${isOpen ? "open" : ""}`}>
              <button
                className="grammar-item-header"
                onClick={() => setOpenId(isOpen ? null : g.id)}
              >
                <div className="grammar-item-title">
                  <span className="grammar-category-tag">{g.category}</span>
                  <strong>{g.title}</strong>
                </div>
                <span className="grammar-toggle">{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <div className="grammar-item-body">
                  <p className="grammar-explanation">{g.explanation}</p>

                  <div className="grammar-structure">
                    <span className="grammar-structure-label">構文</span>
                    <code>{g.structure}</code>
                  </div>

                  <div className="grammar-examples">
                    <span className="grammar-examples-label">例文</span>
                    {g.examples.map((ex, i) => (
                      <div key={i} className="grammar-example">
                        <p className="grammar-example-en">{ex.en}</p>
                        <p className="grammar-example-ja">{ex.ja}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
