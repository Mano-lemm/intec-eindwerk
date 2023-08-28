import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const codeRouter = createTRPCRouter({
  getAllProjectTitlesAndIds: publicProcedure
    .input(z.object({ UID: z.number() }))
    .query(async ({ input }) => {
      return [
        { id: 0, title: "sus" },
        { id: 1, title: "amongus" },
        { id: 2, title: "imposter" },
      ];
    }),
  new: publicProcedure
    .input(z.object({ UID: z.number(), title: z.string().min(4).max(18) }))
    .query(async ({ input }) => {
      return 3;
    }),
});
