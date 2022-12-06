import type { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const itemRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.item.findMany({
      include: {
        users: true,
        category: true,
        status: true,
        ItemStatus: true,
      },
    });
  }),
  add: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        status: z.string(),
        category: z.string(),
        users: z.array(z.string()),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.item.create({
        data: {
          ...input,
          category: {
            connect: {
              id: input.category,
            },
          },
          status: {
            connect: {
              id: input.status,
            },
          },
          users: {
            connect: input.users.map((id) => ({ id })),
          },
          ItemStatus: {
            create: {
              status: {
                connect: {
                  id: input.status,
                },
              },
            },
          },
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        status: z.string(),
        category: z.string(),
        users: z.array(z.string()),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, ...rest } = input;
      return ctx.prisma.item.update({
        where: {
          id: id,
        },
        data: {
          ...rest,
          status: {
            connect: {
              id: input.status,
            },
          },
          category: {
            connect: {
              id: input.category,
            },
          },
          users: {
            connect: input.users.map((id) => ({ id })),
          },
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
      return ctx.prisma.item.delete({
        where: {
          id: input.id,
        },
      });
    }),
});

export type ItemRouter = typeof itemRouter;
export type ItemRouterOutput = inferRouterOutputs<ItemRouter>;
