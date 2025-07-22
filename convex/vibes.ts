import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const addVibe = mutation({
  args: {
    name: v.string(),
    message: v.string(),
    lat: v.float64(),
    lng: v.float64(),
    mediaUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("vibes", {
      ...args,
      createdAt: BigInt(Date.now()),
    });
  },
});

export const getVibes = query({
  handler: async (ctx) => {
    return await ctx.db.query("vibes").collect();
  },
});

export const addCustomEmoji = mutation({
  args: {
    vibeId: v.id("vibes"),
    emoji: v.string(),
  },
  handler: async (ctx, { vibeId, emoji }) => {
    const vibe = await ctx.db.get(vibeId);
    if (!vibe) throw new Error("Vibe not found");

    const current = vibe.customEmojis ?? [];
    if (current.includes(emoji)) return;

    await ctx.db.patch(vibeId, {
      customEmojis: [...current, emoji],
    });
  },
});

export const addComment = mutation({
  args: {
    vibeId: v.id("vibes"),
    name: v.string(),
    message: v.string(),
  },
  handler: async (ctx, { vibeId, name, message }) => {
    const vibe = await ctx.db.get(vibeId);
    if (!vibe) throw new Error("Vibe not found");

    await ctx.db.insert("comments", {
      vibeId,
      name,
      text: message,
      createdAt: Date.now(),
    });
  },
});

export const getCommentsByVibe = query({
  args: { vibeId: v.id("vibes") },
  handler: async (ctx, { vibeId }) => {
    return await ctx.db
      .query("comments")
      .withIndex("byVibe", (q) => q.eq("vibeId", vibeId))
      .order("desc")
      .collect();
  },
});
