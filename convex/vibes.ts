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
