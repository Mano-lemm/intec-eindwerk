import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ uname: z.string(), pwd: z.string().min(6) }))
    .output(z.object({id: z.number(), name: z.string()}))
    .query(async ({ input }) => {
      const response = await fetch(`${process.env.SERVER_BASE_URL}/user/login?name=${input.uname}&pwd=${input.pwd}`)
      if(response.status != 200){
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "bad internal response"
        })
      }
      return response.json()
    }),
  register: publicProcedure
    .input(z.object({ uname: z.string(), pwd: z.string().min(6) }))
    .output(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const response = await fetch(`${process.env.SERVER_BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({name: input.uname, pwd: input.pwd})
      })
      if(response.status != 200){
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "bad internal response"
        })
      }
      return response.json();
    }),
});
