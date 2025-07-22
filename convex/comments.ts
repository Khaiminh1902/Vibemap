import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addComment = mutation({
  args: {
    vibeId: v.id("vibes"),
    name: v.string(),
    text: v.string(),
  },
  handler: async (ctx, { vibeId, name, text }) => {
    await ctx.db.insert("comments", {
      vibeId,
      name,
      text,
      createdAt: Date.now(),
    });
  },
});

export const getComments = query({
  args: {
    vibeId: v.id("vibes"),
  },
  handler: async (ctx, { vibeId }) => {
    return await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("vibeId"), vibeId))
      .order("desc")
      .collect();
  },
});
