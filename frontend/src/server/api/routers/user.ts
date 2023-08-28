import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ uname: z.string(), pwd: z.string().min(6) }))
    .query(async ({ input }) => {
      return { id: 1, name: "Mano" };
    }),
  register: publicProcedure
    .input(z.object({ uname: z.string(), pwd: z.string().min(6)}))
    .query(async ({ input }) => {
        console.log(JSON.stringify(input))
        return 1
    }),
});
