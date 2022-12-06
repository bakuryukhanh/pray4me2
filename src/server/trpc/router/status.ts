import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const statusRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.status.findMany();
  }),
  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.status.create({
        data: input,
      });
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.status.update({
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
      return ctx.prisma.status.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
