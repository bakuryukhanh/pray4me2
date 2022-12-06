import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const categoryRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),
  updateAll: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.string().optional(),
          name: z.string(),
          color: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const dbCates = await ctx.prisma.category.findMany();
      const updateCates = input.filter((category) => category.id);
      const createCates = input.filter((category) => !category.id);
      const deleteCates = dbCates.filter(
        (category) => !input.find((inputUser) => inputUser.id === category.id)
      );

      const update = updateCates.map((category) =>
        ctx.prisma.category.update({
          where: {
            id: category.id,
          },
          data: {
            name: category.name,
            color: category.color,
          },
        })
      );

      const create = createCates.map((category) =>
        ctx.prisma.category.create({
          data: {
            ...category,
          },
        })
      );

      const deleteUser = deleteCates.map((category) =>
        ctx.prisma.category.delete({
          where: {
            id: category.id,
          },
        })
      );

      return Promise.all([...update, ...create, ...deleteUser]);
    }),
});
