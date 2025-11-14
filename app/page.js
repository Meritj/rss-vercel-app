'use client'
import React from 'react';
import Sidebar from './components/Sidebar';
import ArticleList from './components/ArticleList';

export default function HomePage() {
  const [sources, setSources] = React.useState([]);
  const [selectedSource, setSelectedSource] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/sources').then(res => res.json()).then(setSources);
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar sources={sources} selectSource={setSelectedSource} selected={selectedSource} />
      <ArticleList source={selectedSource} />
    </div>
  );
}
