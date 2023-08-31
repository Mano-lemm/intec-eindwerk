import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const codeRouter = createTRPCRouter({
  getAllProjectTitlesAndIds: publicProcedure
    .input(z.object({ UID: z.number() }))
    .output(
      z.object({
        codeInfo: z.array(z.object({ id: z.number(), name: z.string() })),
      }),
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `${process.env.SERVER_BASE_URL}/user/getProjects?id=${input.UID}`,
      );
      return response.json();
    }),
  newProject: publicProcedure
    .input(
      z.object({
        ownderId: z.number(),
        ownderPwd: z.string(),
        title: z.string().min(4).max(18),
      }),
    )
    .output(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const response = await fetch(
        `${process.env.SERVER_BASE_URL}/code/post/new`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            ownerId: input.ownderId,
            ownerPwd: input.ownderPwd,
            code: "new project",
            name: input.title,
          }),
        },
      );
      return response.json();
    }),
  getDetails: publicProcedure
    .input(z.object({id: z.number(), pwd: z.string()}))
    .output(z.object({code: z.string(), name: z.string()}))
    .query(async ({input}) => {
      console.log(JSON.stringify(input))
      const response = await fetch(`${process.env.SERVER_BASE_URL}/code/get/Id?id=${input.id}&pwd=${input.pwd}`)
      return response.json()
    })
});
