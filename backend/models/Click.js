import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  slug: { type: String, required: true, index: true },
  ts: { type: Date, default: Date.now, index: true },
  referrer: String,
  country: String,
  userAgent: String,
});

export default mongoose.model("Click", clickSchema);
