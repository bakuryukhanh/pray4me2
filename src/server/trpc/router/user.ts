import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
        color: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.create({
        data: input,
      });
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        color: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
