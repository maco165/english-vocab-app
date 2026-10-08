import { useState } from "react";
import words from "../data/words";
import { SearchIcon } from "./icons";
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
      <div className="page-header wordlist-header">
        <h1>単語一覧</h1>
        <span className="page-count wordlist-count">{filtered.length} / {words.length} 語</span>
      </div>

      <div className="search-box">
        <SearchIcon size={20} />
        <input
          className="wordlist-search"
          type="text"
          placeholder="単語を検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="search-box-note">A–Z 順</span>
      </div>

      <ol className="wordlist-items">
        {filtered.map((w) => (
          <li key={w.id} className="word-card wordlist-item">
            <span className="wordlist-id">{String(w.id).padStart(3, "0")}</span>
            <div className="wordlist-body">
              <div className="word-head">
                <span className="word-en wordlist-english">{w.english}</span>
                <span className="word-ja wordlist-japanese">{w.japanese}</span>
              </div>
              <p className="word-example wordlist-example">{w.example}</p>
              {w.exampleJa && <p className="word-example-ja wordlist-example-ja">{w.exampleJa}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
