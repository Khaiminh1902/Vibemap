import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  vibes: defineTable({
    lat: v.float64(),
    lng: v.float64(),
    name: v.string(),
    message: v.string(),
    createdAt: v.int64(),
    mediaUrl: v.optional(v.string()),
    customEmojis: v.optional(v.array(v.string())),
  }),
  reactions: defineTable({
    vibeId: v.id("vibes"),
    emoji: v.string(),
    deviceId: v.string(),
    reactedAt: v.int64(),
  }).index("byVibe", ["vibeId"]),
  comments: defineTable({
    vibeId: v.id("vibes"),
    name: v.string(),
    text: v.string(),
    createdAt: v.number(),
  }).index("byVibe", ["vibeId"]),
});
