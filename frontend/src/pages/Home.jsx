import ShortenForm from "../components/ShortenForm.jsx";

export default function Home() {
  return (
    <div className="stack">
      <h1>Shorten a URL</h1>
      <p className="muted">Paste a long link and get a short one. Track clicks on the dashboard.</p>
      <ShortenForm />
    </div>
  );
}
