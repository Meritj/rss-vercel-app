export default function Sidebar({ sources, selectSource, selected }) {
  return (
    <div style={{ width: 250, borderRight: '1px solid #ccc', padding: 15 }}>
      {sources.map(src => (
        <div
          key={src.url}
          style={{
            cursor: 'pointer',
            background: selected === src.url ? '#eef' : 'transparent',
            padding: 8, marginBottom: 2
          }}
          onClick={() => selectSource(src.url)}
        >{src.name}</div>
      ))}
    </div>
  );
}
