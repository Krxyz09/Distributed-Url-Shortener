import Url from "../models/Url.js";
import Click from "../models/Click.js";
import Counter from "../models/Counter.js";
import { encode } from "../utils/base62.js";
import { cache } from "../services/cache.js";

const COUNTER_ID = "url_counter";
const COUNTER_OFFSET = 10000; // start slugs at a few chars long

const getBaseUrl = () => {
  const base = process.env.BASE_URL || "http://localhost";
  return base.replace(/\/$/, "");
};

async function nextSlug() {
  const c = await Counter.findByIdAndUpdate(
    COUNTER_ID,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return encode(c.seq + COUNTER_OFFSET);
}

export async function createShortUrl(req, res) {
  try {
    const { longUrl } = req.body;
    if (!longUrl || !/^https?:\/\//i.test(longUrl)) {
      return res.status(400).json({ error: "Provide a valid http(s) URL" });
    }

    const base = getBaseUrl();

    // ==========================================
    // SAFE FIX: Use MongoDB to check for duplicates
    // ==========================================
    const existingDoc = await Url.findOne({ longUrl }).lean();
    if (existingDoc) {
      // If found in the DB, return it immediately without incrementing the counter
      return res.json({
        slug: existingDoc.slug,
        longUrl: existingDoc.longUrl,
        shortUrl: `${base}/${existingDoc.slug}`,
        createdAt: existingDoc.createdAt,
      });
    }

    // ==========================================
    // NEW LINK FLOW: Only runs if URL is unique
    // ==========================================
    const slug = await nextSlug();
    const doc = await Url.create({ slug, longUrl });

    // Optional cache population (wrapped safely so errors don't stall execution)
    try {
      await cache.set(slug, longUrl);
    } catch (cacheErr) {
      console.warn("Cache write skipped:", cacheErr.message);
    }

    res.json({
      slug: doc.slug,
      longUrl: doc.longUrl,
      shortUrl: `${base}/${doc.slug}`,
      createdAt: doc.createdAt,
    });

  } catch (err) {
    console.error("Shortening Error:", err);
    res.status(500).json({ error: "Failed to shorten URL" });
  }
}

export async function redirectAndLog(req, res) {
  try {
    const { slug } = req.params;

    // Cache-first lookup
    let longUrl = await cache.get(slug);
    if (!longUrl) {
      const doc = await Url.findOne({ slug });
      if (!doc) return res.status(404).send("Not found");
      longUrl = doc.longUrl;
      await cache.set(slug, longUrl);
    }

    // Fire-and-forget analytics
    Promise.all([
      Click.create({
        slug,
        ts: new Date(),
        referrer: req.headers.referer || "",
        country: req.headers["cf-ipcountry"] || "",
        userAgent: req.headers["user-agent"] || "",
      }),
      Url.updateOne({ slug }, { $inc: { clicks: 1 } }),
    ]).catch((e) => console.error("click log failed", e));

    res.redirect(302, longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

export async function listUrls(_req, res) {
  const urls = await Url.find().sort({ createdAt: -1 }).limit(50).lean();
  res.json(urls);
}