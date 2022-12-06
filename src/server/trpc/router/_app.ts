import { router } from "../trpc";
import { categoryRouter } from "./category";
import { itemRouter } from "./item";
import { itemStatus } from "./itemStatus";
import { statusRouter } from "./status";
import { userRouter } from "./user";

export const appRouter = router({
  item: itemRouter,
  category: categoryRouter,
  status: statusRouter,
  user: userRouter,
  itemStatus: itemStatus,
});

// export type definition of API
export type AppRouter = typeof appRouter;
