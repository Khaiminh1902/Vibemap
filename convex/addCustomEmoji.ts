import { mutation } from "@/convex/_generated/server";
import { v } from "convex/values";

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
