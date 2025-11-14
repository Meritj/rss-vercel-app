import React from "react";

export default function ArticleItem({ article, sourceUrl }) {
  const [showDesc, setShowDesc] = React.useState(false);
  const [isSeen, setIsSeen] = React.useState(article.seen);
  function markSeen() {
    if (!isSeen) {
      fetch('/api/mark-seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: sourceUrl, link: article.link })
      }).then(() => setIsSeen(true));
    }
    window.open(article.link, '_blank');
  }
  return (
    <div style={{
      marginBottom: 10,
      background: isSeen ? '#eee' : '#e3efff',
      color: isSeen ? "#666" : "#0040af",
      padding: 10,
      borderRadius: 6
    }}>
      <div>
        <span
          style={{ cursor: 'pointer', fontWeight: 600, marginRight: 8 }}
          onClick={markSeen}
        >{article.title}</span>
        <button style={{ marginLeft: 8, fontSize: 12 }} onClick={() => setShowDesc(s => !s)}>{showDesc ? "Masquer" : "Afficher"}</button>
      </div>
      {showDesc && <div style={{ marginTop: 8, fontSize: 14 }}>{article.description}</div>}
    </div>
  );
}
