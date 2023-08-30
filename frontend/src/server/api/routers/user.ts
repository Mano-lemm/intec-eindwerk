import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ uname: z.string(), pwd: z.string().min(6) }))
    .query(async ({ input }) => {
      const url_base = process.env.SERVER_BASE_URL
      if(url_base == undefined){
        console.log(url_base)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "fetch url is not defined"
        })
      }
      const response = await fetch(`${url_base}/login?name=${input.uname}&pwd=${input.pwd}`)
      const r_json = response.json
      console.log(JSON.stringify(r_json))
      return z.object({id: z.number(), name: z.string()}).parse(r_json)
    }),
  register: publicProcedure
    .input(z.object({ uname: z.string(), pwd: z.string().min(6) }))
    .query(async ({ input }) => {
      console.log(JSON.stringify(input));
      return 1;
    }),
});
