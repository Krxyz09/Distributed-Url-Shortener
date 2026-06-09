import Url from "../models/Url.js";
import Click from "../models/Click.js";

export async function summary(_req, res) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [totalLinks, totalClicks, clicks24h] = await Promise.all([
    Url.countDocuments(),
    Click.countDocuments(),
    Click.countDocuments({ ts: { $gte: since } }),
  ]);
  res.json({ totalLinks, totalClicks, clicks24h });
}

export async function timeseries(req, res) {
  const bucket = req.query.bucket === "day" ? "day" : "hour";
  const range = req.query.range || "24h";
  const slug = req.query.slug;

  const rangeMs =
    range === "7d" ? 7 * 86400e3 : range === "30d" ? 30 * 86400e3 : 24 * 3600e3;
  const since = new Date(Date.now() - rangeMs);

  const match = { ts: { $gte: since } };
  if (slug) match.slug = slug;

  const data = await Click.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateTrunc: { date: "$ts", unit: bucket } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, time: "$_id", count: 1 } },
  ]);

  res.json(data);
}

export async function topUrls(req, res) {
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const data = await Url.find().sort({ clicks: -1 }).limit(limit).lean();
  res.json(data);
}
