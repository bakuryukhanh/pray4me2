import style from "./index.module.scss";
import { Select, Spin, Tooltip } from "antd";
import { MultipleContainers } from "../../MultipleContainer/MultipleContainers";
import { trpc } from "@/utils/trpc";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Category, Item, ItemStatus, Status, User } from "@prisma/client";

type TItemFull = Item & {
  ItemStatus: ItemStatus[];
  status: Status | null;
  category: Category;
  users: User[];
};

const Main = ({
  initialItems,
  initialStatusArr,
}: {
  initialItems?: TItemFull[];
  initialStatusArr?: Status[];
}) => {
  const { data: items } = trpc.item.getAll.useQuery();
  const { data: statusArr } = trpc.status.getAll.useQuery();

  const itemData = items ? items : initialItems;
  const statusData = statusArr ? statusArr : initialStatusArr;
  if (!itemData || !statusData) return <Spin />;

  const data = statusData.reduce(
    (acc, status) => {
      acc[status.id] = itemData
        .filter((item) => item.statusId === status.id)
        .sort((a, b) => {
          if (!a.ItemStatus[0]?.index || !b.ItemStatus[0]?.index) return 0;
          return a.ItemStatus[0].index.getTime() -
            b.ItemStatus[0].index.getTime() >
            0
            ? 1
            : -1;
        });
      return acc;
    },
    {} as {
      [key: string]: TItemFull[];
    }
  );

  return (
    <div className={style["container"]}>
      <div className={style["header"]}>
        <h2 className={style["title"]}>Board</h2>

        <Select bordered={false} defaultValue="week" className={style.select}>
          <Select.Option value="week">This Week</Select.Option>
        </Select>
      </div>
      <div className={style["content"]}>
        <MultipleContainers items={data} statusArr={statusData} />
      </div>
    </div>
  );
};

export default Main;
