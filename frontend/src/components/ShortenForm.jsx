import { useState } from "react";
import { api } from "../api.js";

export default function ShortenForm() {
  const [longUrl, setLongUrl] = useState("");
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setResult(null);
    setLoading(true);
    try {
      const { data } = await api.post("/shorten", { longUrl });
      setResult(data);
    } catch (e) {
      setErr(e.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card stack">
      <input
        type="url"
        required
        placeholder="https://example.com/very/long/url"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
      />
      <button disabled={loading} type="submit">
        {loading ? "Shortening…" : "Shorten"}
      </button>
      {err && <p className="error">{err}</p>}
      {result && (
        <div className="result">
          <span>Short URL:</span>
          <a href={result.shortUrl} target="_blank" rel="noreferrer">{result.shortUrl}</a>
          <button type="button" onClick={() => navigator.clipboard.writeText(result.shortUrl)}>Copy</button>
        </div>
      )}
    </form>
  );
}
