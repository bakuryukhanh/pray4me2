import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
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
      const dbUsers = await ctx.prisma.user.findMany();
      const updateUser = input.filter((user) => user.id);
      const createUser = input.filter((user) => !user.id);
      const deleteUsers = dbUsers.filter(
        (user) => !input.find((inputUser) => inputUser.id === user.id)
      );

      const update = updateUser.map((user) =>
        ctx.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: user.name,
            color: user.color,
          },
        })
      );

      const create = createUser.map((user) =>
        ctx.prisma.user.create({
          data: {
            ...user,
          },
        })
      );

      const deleteUser = deleteUsers.map((user) =>
        ctx.prisma.user.delete({
          where: {
            id: user.id,
          },
        })
      );

      return Promise.all([...update, ...create, ...deleteUser]);
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
});
