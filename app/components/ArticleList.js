import ArticleItem from './ArticleItem';
export default function ArticleList({ source }) {
  const [articles, setArticles] = React.useState([]);
  React.useEffect(() => {
    if (source) {
      fetch(`/api/articles?url=${encodeURIComponent(source)}`)
        .then(res => res.json())
        .then(setArticles);
    }
  }, [source]);
  return (
    <div style={{ flex: 1, padding: 20 }}>
      {!source ? "Sélectionnez une source." :
        articles.map(a => <ArticleItem key={a.link} article={a} sourceUrl={source} />)}
    </div>
  );
}
