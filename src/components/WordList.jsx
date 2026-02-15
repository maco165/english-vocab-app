import { useState } from "react";
import words from "../data/words";
import "./WordList.css";

export default function WordList() {
  const [search, setSearch] = useState("");

  const filtered = words.filter(
    (w) =>
      w.english.toLowerCase().includes(search.toLowerCase()) ||
      w.japanese.includes(search)
  );

  return (
    <div className="wordlist">
      <div className="wordlist-header">
        <h2>単語一覧</h2>
        <span className="wordlist-count">{filtered.length} / {words.length} 語</span>
      </div>

      <input
        className="wordlist-search"
        type="text"
        placeholder="単語を検索..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="wordlist-items">
        {filtered.map((w) => (
          <div key={w.id} className="wordlist-item">
            <div className="wordlist-main">
              <span className="wordlist-id">{w.id}</span>
              <strong className="wordlist-english">{w.english}</strong>
              <span className="wordlist-japanese">{w.japanese}</span>
            </div>
            <p className="wordlist-example">{w.example}</p>
            {w.exampleJa && <p className="wordlist-example-ja">{w.exampleJa}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
