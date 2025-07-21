import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  vibes: defineTable({
    lat: v.float64(),
    lng: v.float64(),
    name: v.string(),
    message: v.string(),
    createdAt: v.int64(),
  }),
});
