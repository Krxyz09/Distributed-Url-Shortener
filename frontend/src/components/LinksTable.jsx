export default function LinksTable({ urls }) {
  if (!urls?.length) return <p className="muted">No links yet.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Slug</th>
            <th>Target</th>
            <th>Clicks</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((u) => (
            <tr key={u.slug}>
              <td><code>{u.slug}</code></td>
              <td className="truncate"><a href={u.longUrl} target="_blank" rel="noreferrer">{u.longUrl}</a></td>
              <td>{u.clicks}</td>
              <td>{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
