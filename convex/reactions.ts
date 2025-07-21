import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export { addCustomEmoji } from "./addCustomEmoji";

export const toggleReaction = mutation({
  args: {
    vibeId: v.id("vibes"),
    emoji: v.string(),
    deviceId: v.string(),
  },
  handler: async (ctx, { vibeId, emoji, deviceId }) => {
    const existing = await ctx.db
      .query("reactions")
      .withIndex("byVibe", (q) => q.eq("vibeId", vibeId))
      .collect();

    const current = existing.find((r) => r.deviceId === deviceId);

    if (current) {
      if (current.emoji === emoji) {
        await ctx.db.delete(current._id);
      } else {
        await ctx.db.patch(current._id, {
          emoji,
          reactedAt: BigInt(Date.now()),
        });
      }
    } else {
      await ctx.db.insert("reactions", {
        vibeId,
        emoji,
        deviceId,
        reactedAt: BigInt(Date.now()),
      });
    }
  },
});

export const getReactions = query({
  args: {
    vibeId: v.id("vibes"),
  },
  handler: async (ctx, { vibeId }) => {
    return await ctx.db
      .query("reactions")
      .withIndex("byVibe", (q) => q.eq("vibeId", vibeId))
      .collect();
  },
});

export const getAllReactions = query({
  handler: async (ctx) => {
    return await ctx.db.query("reactions").collect();
  },
});
