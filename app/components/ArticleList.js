'use client';
import { useState, useEffect } from 'react';
import ArticleItem from './ArticleItem';

export default function ArticleList({ source }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (source) {
      fetch(`/api/articles?url=${encodeURIComponent(source)}`)
        .then(async (res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const text = await res.text();
          return text ? JSON.parse(text) : [];
        })
        .then(setArticles)
        .catch((err) => {
          console.error("Erreur API:", err);
          setArticles([]); // fallback
        });
    }
  }, [source]);

  return (
    <div style={{ flex: 1, padding: 20 }}>
      {!source
        ? "Sélectionnez une source."
        : articles.map(a => (
            <ArticleItem key={a.link} article={a} sourceUrl={source} />
          ))
      }
    </div>
  );
}
