import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  vibes: defineTable({
    name: v.string(),
    mood: v.string(),
    message: v.string(),
    lat: v.float64(),
    lng: v.float64(),
    createdAt: v.int64(),
  }),
});
