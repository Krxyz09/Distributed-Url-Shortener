import { useEffect, useState } from "react";
import { api } from "../api.js";
import StatCard from "../components/StatCard.jsx";
import ClicksChart from "../components/ClicksChart.jsx";
import TopUrlsChart from "../components/TopUrlsChart.jsx";
import LinksTable from "../components/LinksTable.jsx";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [series, setSeries] = useState([]);
  const [top, setTop] = useState([]);
  const [urls, setUrls] = useState([]);
  const [bucket, setBucket] = useState("hour");
  const [range, setRange] = useState("24h");

  useEffect(() => {
    api.get("/analytics/summary").then((r) => setSummary(r.data)).catch(() => {});
    api.get("/analytics/top?limit=10").then((r) => setTop(r.data)).catch(() => {});
    api.get("/urls").then((r) => setUrls(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    api
      .get(`/analytics/timeseries?bucket=${bucket}&range=${range}`)
      .then((r) => setSeries(r.data))
      .catch(() => {});
  }, [bucket, range]);

  return (
    <div className="stack">
      <h1>Analytics Dashboard</h1>

      <div className="grid grid-3">
        <StatCard label="Total Links" value={summary?.totalLinks ?? "—"} />
        <StatCard label="Total Clicks" value={summary?.totalClicks ?? "—"} />
        <StatCard label="Clicks (24h)" value={summary?.clicks24h ?? "—"} />
      </div>

      <section className="card">
        <div className="row spread">
          <h2>Click Trends</h2>
          <div className="controls">
            <select value={bucket} onChange={(e) => setBucket(e.target.value)}>
              <option value="hour">Hourly</option>
              <option value="day">Daily</option>
            </select>
            <select value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
        </div>
        <ClicksChart data={series} />
      </section>

      <section className="card">
        <h2>Top URLs</h2>
        <TopUrlsChart data={top} />
      </section>

      <section className="card">
        <h2>Recent Links</h2>
        <LinksTable urls={urls} />
      </section>
    </div>
  );
}
