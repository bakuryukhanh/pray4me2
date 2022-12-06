import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const itemStatus = router({
  updateIndex: publicProcedure
    .input(
      z.object({
        id: z.string(),
        index: z.date(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.itemStatus.updateMany({
        where: {
          id: input.id,
        },
        data: {
          index: input.index,
        },
      });
    }),
});
